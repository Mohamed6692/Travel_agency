const express = require("express");
const { io } = require("../index"); 
const Chauffeur = require("../models/Chauffeur");
const auth = require("../middleware/auth");
const router = express.Router();
const formidable = require("formidable");
const excelToJson = require("convert-excel-to-json");
const Errors = require("../helpers/Errors");
const CatchAsyncError = require("../helpers/CatchAsyncError");

// CREATE A Chauffeur
router.post(
  "/create",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      console.log("Données reçues avant validation:", req.body);

      // Vérifier si le numéro de permis existe déjà
      const existingChauffeur = await Chauffeur.findOne({ permis_numero: req.body.permis_numero });
      if (existingChauffeur) {
        return next(new Errors("Ce numéro de permis existe déjà.", 400));
      }

      // Ajouter l'ID de l'utilisateur connecté dans les données
      req.body.user_id = req.user.id; // Ajoutez l'ID utilisateur dans les données du chauffeur
      const io = req.app.get("socketio");
      const chauffeur = new Chauffeur(req.body);
      await chauffeur.validate(); // Vérifie les erreurs Mongoose avant la sauvegarde
      io.emit("chauffeur:update", { type: "create", chauffeur });
      console.log("Données validées. Enregistrement en cours...");

      const response = await chauffeur.save();
      res.status(201).json({ success: true, message: "Chauffeur créé avec succès", chauffeur: response });
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      next(new Errors(error.message || "Erreur lors de la création du chauffeur", 400));
    }
  })
);

// GET ALL CHAUFFEURS avec pagination
router.get(
  "/all",
  CatchAsyncError(async (req, res, next) => {
    try {
      let page = parseInt(req.query.page);
      let limit = parseInt(req.query.limit);
      let skip = (page - 1) * limit;
      
      let totalChauffeurs = await Chauffeur.countDocuments();
      let chauffeurs = await Chauffeur.find()
        .populate("user_id", "firstName lastName")
        .skip(skip)
        .limit(limit);
      
      res.status(200).json({
        success: true,
        chauffeurs,
        currentPage: page,
        totalPages: Math.ceil(totalChauffeurs / limit),
        totalChauffeurs
      });
    } catch (error) {
      next(new Errors("Erreur lors de la récupération des chauffeurs", 400));
    }
  })
);

// GET A SINGLE Chauffeur
router.get(
  "/:id",
  CatchAsyncError(async (req, res, next) => {
    try {
      const chauffeur = await Chauffeur.findById(req.params.id);
      if (!chauffeur) return next(new Errors("Chauffeur non trouvé", 404));
      res.status(200).json({ success: true, chauffeur });
    } catch (error) {
      next(new Errors("Erreur lors de la récupération du chauffeur", 400));
    }
  })
);

// UPDATE A Chauffeur
router.put(
  "/:id",
  auth, // Ajout de l'authentification pour la mise à jour
  CatchAsyncError(async (req, res, next) => {
    try {
      const io = req.app.get("socketio");
      const chauffeur = await Chauffeur.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      io.emit("chauffeur:update", { type: "update", chauffeur });
      if (!chauffeur) return next(new Errors("Chauffeur non trouvé", 404));
      res.status(200).json({ success: true, message: "Chauffeur mis à jour", chauffeur });
    } catch (error) {
      next(new Errors("Erreur lors de la mise à jour du chauffeur", 400));
    }
  })
);

// Mettre à jour un chauffeur
router.put("/:id/update", auth, CatchAsyncError(async (req, res) => {
  const { statut } = req.body;
  const io=req.app.get("socketio");
  const chauffeur = await Chauffeur.findByIdAndUpdate(req.params.id, { statut }, { new: true });
  io.emit("chauffeur:update", { type: "update", chauffeur });
  if (!chauffeur) {
    return res.status(404).json({ message: "Chauffeur non trouvé" });
  }
  res.status(200).json(chauffeur);
}));


// DELETE A Chauffeur
router.delete(
  "/:id",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      const io = req.app.get("socketio");
      const chauffeur = await Chauffeur.findByIdAndDelete(req.params.id);
      io.emit("chauffeur:update", { type: "delete", id: req.params.id });
      res.status(201).json({ success: true, message: "Chauffeur supprimé", chauffeur });
    } catch (error) {
      next(new Errors(error.message, 400));
    }
  })
);

// DELETE MULTIPLE Chauffeurs
router.post(
  "/more",
  CatchAsyncError(async (req, res, next) => {
    try {
      const response = await Chauffeur.deleteMany({ _id: { $in: req.body.ids } });
      res.status(200).json({ success: true, message: "Chauffeurs supprimés avec succès", response });
    } catch (error) {
      next(new Errors("Erreur lors de la suppression des chauffeurs", 400));
    }
  })
);

module.exports = router;
