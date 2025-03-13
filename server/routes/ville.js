const express = require("express");
const Ville = require("../models/Ville");
const auth = require("../middleware/auth");
const router = express.Router();
const Errors = require("../helpers/Errors");
const CatchAsyncError = require("../helpers/CatchAsyncError");

// CRÉER UNE VILLE
router.post(
  "/create",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      console.log("Données reçues avant validation:", req.body);
      
      // Vérifier si la ville existe déjà
      const existingVille = await Ville.findOne({ nom: req.body.nom });
      if (existingVille) {
        return next(new Errors("Cette ville est déjà enregistrée.", 400));
      }
      
      const ville = new Ville(req.body);
      await ville.validate();
      console.log("Données validées. Enregistrement en cours...");
      
      const response = await ville.save();
      res.status(201).json({ success: true, message: "Ville créée avec succès", ville: response });
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      next(new Errors(error.message || "Erreur lors de la création de la ville", 400));
    }
  })
);

// RÉCUPÉRER TOUTES LES VILLES
router.get(
  "/all",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      let villes = await Ville.find();
      res.status(200).json({ success: true, villes });
    } catch (error) {
      next(new Errors("Erreur lors de la récupération des villes", 400));
    }
  })
);

// RÉCUPÉRER UNE SEULE VILLE
router.get(
  "/:id",
  CatchAsyncError(async (req, res, next) => {
    try {
      const ville = await Ville.findById(req.params.id);
      if (!ville) return next(new Errors("Ville non trouvée", 404));
      res.status(200).json({ success: true, ville });
    } catch (error) {
      next(new Errors("Erreur lors de la récupération de la ville", 400));
    }
  })
);

// METTRE À JOUR UNE VILLE
router.put(
  "/:id",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      console.log("Données reçues pour la mise à jour :", req.body);
      
      const ville = await Ville.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!ville) return next(new Errors("Ville non trouvée", 404));
      
      res.status(200).json({ success: true, message: "Ville mise à jour avec succès", ville });
    } catch (error) {
      next(new Errors(error.message || "Erreur lors de la mise à jour de la ville", 400));
    }
  })
);

// SUPPRIMER UNE VILLE
router.delete(
  "/:id",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      const ville = await Ville.findByIdAndDelete(req.params.id);
      if (!ville) return next(new Errors("Ville non trouvée", 404));
      res.status(200).json({ success: true, message: "Ville supprimée avec succès" });
    } catch (error) {
      next(new Errors(error.message, 400));
    }
  })
);

module.exports = router;
