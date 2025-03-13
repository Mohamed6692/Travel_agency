const express = require("express");
const { io } = require("../index"); 
const Vehicule = require("../models/Vehicule");
const auth = require("../middleware/auth");
const router = express.Router();
const formidable = require("formidable");
const excelToJson = require("convert-excel-to-json");
const Errors = require("../helpers/Errors");
const CatchAsyncError = require("../helpers/CatchAsyncError");

// CREATE A VEHICLE
router.post(
  "/create",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      console.log("Données reçues avant validation:", req.body);

      // Vérifier si l'immatriculation existe déjà
      const existingVehicule = await Vehicule.findOne({ immatriculation: req.body.immatriculation });
      if (existingVehicule) {
        return next(new Errors("Cette immatriculation est déjà enregistrée.", 400));
      }
      const io = req.app.get("socketio");
      const vehicule = new Vehicule(req.body);
      await vehicule.validate(); // Vérifie les erreurs Mongoose avant la sauvegarde
      io.emit("vehicule:update", { type: "create", vehicule });
      console.log("Données validées. Enregistrement en cours...");

      const response = await vehicule.save();
      res.status(201).json({ success: true, message: "Véhicule créé avec succès", vehicule: response });
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      next(new Errors(error.message || "Erreur lors de la création du véhicule", 400));
    }
  })
);




// GET ALL VEHICLES avec pagination
router.get(
  "/all",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      const io = req.app.get("socketio");
      let page = parseInt(req.query.page) ;
      let limit = parseInt(req.query.limit) ;
      let skip = (page - 1) * limit;
      
      let totalVehicules = await Vehicule.countDocuments();
      let vehicules = await Vehicule.find()
        .populate("chauffeur_id", "firstName lastName")
        .skip(skip)
        .limit(limit);
      
      res.status(200).json({
        success: true,
        vehicules,
        currentPage: page,
        totalPages: Math.ceil(totalVehicules / limit),
        totalVehicules
      });
    } catch (error) {
      next(new Errors("Erreur lors de la récupération des véhicules", 400));
    }
  })
);


// GET A SINGLE VEHICLE
router.get(
  "/:id",
  CatchAsyncError(async (req, res, next) => {
    try {
      const vehicule = await Vehicule.findById(req.params.id);
      if (!vehicule) return next(new Errors("Véhicule non trouvé", 404));
      res.status(200).json({ success: true, vehicule });
    } catch (error) {
      next(new Errors("Erreur lors de la récupération du véhicule", 400));
    }
  })
);




// UPDATE A VEHICLE
router.put(
  "/:id",
  auth, // Assurez-vous que l'utilisateur est authentifié
  CatchAsyncError(async (req, res, next) => {
    try {
      const io = req.app.get("socketio");
      console.log("Données reçues pour la mise à jour :", req.body);
      
      const vehicule = await Vehicule.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

      if (!vehicule) return next(new Errors("Véhicule non trouvé", 404));

      res.status(200).json({ success: true, message: "Véhicule mis à jour avec succès", vehicule });
      io.emit("vehicule:update", { type: "update", vehicule });
    } catch (error) {
      next(new Errors(error.message || "Erreur lors de la mise à jour du véhicule", 400));
    }
  })
);


router.put("/:id/update", auth, CatchAsyncError(async (req, res) => {
  const { statut } = req.body;
  const io = req.app.get("socketio");
  const vehicule = await Vehicule.findByIdAndUpdate(req.params.id, { statut }, { new: true });
  io.emit("vehicule:update", { type: "update", vehicule });
  if (!vehicule) {
    return res.status(404).json({ message: "Véhicule non trouvé" });
  }
  res.status(200).json(vehicule);
}));


// DELETE A VEHICLE
router.delete(
  "/:id",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      const io = req.app.get("socketio");
      const vehicule = await Vehicule.findByIdAndDelete(req.params.id);
      io.emit("vehicule:update", { type: "delete", id: req.params.id });
      res.status(201).json({ success: true, message: "Chauffeur supprimé", vehicule });
    } catch (error) {
      next(new Errors(error.message, 400));
    }
  })
);

// DELETE MULTIPLE VEHICLES
router.post(
  "/more",
  CatchAsyncError(async (req, res, next) => {
    try {
      const response = await Vehicule.deleteMany({ _id: { $in: req.body.ids } });
      res.status(200).json({ success: true, message: "Véhicules supprimés avec succès", response });
    } catch (error) {
      next(new Errors("Erreur lors de la suppression des véhicules", 400));
    }
  })
);

// IMPORT VEHICLES FROM EXCEL FILE
router.post(
  "/import",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      let form = new formidable.IncomingForm();
      form.keepExtensions = true;
      form.parse(req, async (err, fields, files) => {
        if (err) {
          return next(new Errors("Les données n'ont pas pu être téléchargées", 400));
        }
        const { data } = excelToJson({
          sourceFile: files.excelFile.filepath,
          columnToKey: {
            A: "immatriculation",
            B: "marque",
            C: "modele",
            D: "capacite",
            E: "statut",
          },
        });
        const vehicules = await Promise.all(
          data.map(async (d) => {
            const vehicule = new Vehicule(d);
            return await vehicule.save();
          })
        );
        res.status(201).json({ success: true, message: "Véhicules importés avec succès", vehicules });
      });
    } catch (error) {
      next(new Errors("Erreur lors de l'importation des véhicules", 400));
    }
  })
);

module.exports = router;
