const express = require("express");
const { io } = require("../index"); 
const Trajet = require("../models/Trajet");
const Vehicule = require("../models/Vehicule");
const Chauffeur = require("../models/Chauffeur");
const auth = require("../middleware/auth");
const router = express.Router();
const formidable = require("formidable");
const excelToJson = require("convert-excel-to-json");
const Errors = require("../helpers/Errors");
const CatchAsyncError = require("../helpers/CatchAsyncError");

// CREATE A TRIP
router.post("/create", auth, async (req, res) => {
  console.log("Données reçues :", req.body);
  try {
    const { origine, destination, distance, prix, horaire_depart, horaire_arrivee, type_transport, chauffeur_id, vehicule_id } = req.body;

    // Vérifier si le chauffeur et le véhicule existent et sont disponibles
    const chauffeur = await Chauffeur.findById(chauffeur_id);
    const vehicule = await Vehicule.findById(vehicule_id);

    if (!chauffeur || chauffeur.statut !== "Disponible") {
      return res.status(400).json({ message: "Chauffeur non disponible" });
    }

    if (!vehicule || vehicule.statut !== "Disponible") {
      return res.status(400).json({ message: "Véhicule non disponible" });
    }

    const io = req.app.get("socketio");

    // Créer le trajet
    const trajet = new Trajet({
      origine,
      destination,
      distance,
      prix,
      horaire_depart,
      horaire_arrivee,
      type_transport,
      chauffeur_id,
      vehicule_id,
    });

    await trajet.save();

    // Mettre à jour les statuts du chauffeur et du véhicule
    const updatedChauffeur = await Chauffeur.findByIdAndUpdate(chauffeur_id, { statut: "En service" }, { new: true });
    await Vehicule.findByIdAndUpdate(vehicule_id, { statut: "Non disponible" });

    // Récupérer les données complètes du chauffeur et du véhicule
    const chauffeurFull = await Chauffeur.findById(chauffeur_id);
    const vehiculeFull = await Vehicule.findById(vehicule_id);

    // Notifier les clients via Socket.IO avec les informations complètes
    io.emit("trajet:created", {
      trajet: { ...trajet.toObject(), chauffeur: chauffeurFull, vehicule: vehiculeFull },
    });

    io.emit("chauffeur:update", { type: "update", chauffeur: updatedChauffeur });

    res.status(201).json({ message: "Trajet créé avec succès", trajet });
  } catch (error) {
    console.error("Erreur lors de la création du trajet:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});




// GET TRIPS WITH SEARCH AND PAGINATION
router.get(
  "/search",
  CatchAsyncError(async (req, res, next) => {
    try {
      let keyword = req.query.q
        ? { departureCity: { $regex: req.query.q, $options: "i" } }
        : {};
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.size) || 5;
      const count = await Trajet.countDocuments({ ...keyword });
      const pages = Math.ceil(count / pageSize);
      const trajets = await Trajet.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .populate("vehicule_id")
        .populate("chauffeur_id")
        .sort("-createdAt");
      res.status(200).json({ success: true, trajets, page, pages });
    } catch (error) {
      next(new Errors("Erreur lors de la récupération des trajets", 400));
    }
  })
);

// GET ALL TRIPS With pagination
router.get(
  "/all",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      const io = req.app.get("socketio");
      let page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 5;
      let skip = (page - 1) * limit;
      
      let totalTrajets = await Trajet.countDocuments();
      let trajets = await Trajet.find()
        .populate("vehicule_id")
        .populate("chauffeur_id")
        .skip(skip)
        .limit(limit);
      
      io.emit("trajets:all", { trajets });
      res.status(200).json({
        success: true,
        trajets,
        currentPage: page,
        totalPages: Math.ceil(totalTrajets / limit),
        totalTrajets
      });
    } catch (error) {
      next(new Errors("Erreur lors de la récupération des trajets", 400));
    }
  })
);

//GET ALL TRIPS WITHOUT PAGINATION
router.get(
  "/all-no-pagination",
  CatchAsyncError(async (req, res, next) => {
    try {
      const trajets = await Trajet.find().populate("vehicule_id").populate("chauffeur_id");
      res.status(200).json({ success: true, trajets });
    } catch (error) {
      next(new Errors("Erreur lors de la récupération des trajets", 400));
    }
  })
);


// GET A SINGLE TRIP
router.get(
  "/:id",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      const trajet = await Trajet.findById(req.params.id).populate("vehicule_id").populate("chauffeur_id");
      if (!trajet) return next(new Errors("Trajet non trouvé", 404));
      res.status(200).json({ success: true, trajet });
    } catch (error) {
      next(new Errors("Erreur lors de la récupération du trajet", 400));
    }
  })
);




// UPDATE A TRIP
router.put("/:id", auth, CatchAsyncError(async (req, res, next) => {
  try {

    const io = req.app.get("socketio");
    const trajet = await Trajet.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!trajet) return next(new Errors("Trajet non trouvé", 404));

    // Notifier les clients via Socket.IO
    io.emit("trajet:updated", { trajet });

    res.status(200).json({ success: true, message: "Modification effectuée", trajet });
  } catch (error) {
    next(new Errors("Erreur lors de la modification du trajet", 400));
  }
}));


// DELETE A TRIP
router.delete("/:id", auth, CatchAsyncError(async (req, res, next) => {
  try {
    const io = req.app.get("socketio");
    const trajet = await Trajet.findByIdAndDelete(req.params.id);
    if (!trajet) return next(new Errors("Trajet non trouvé", 404));

    // Mettre à jour le statut du chauffeur et du véhicule associés
    const chauffeur = await Chauffeur.findById(trajet.chauffeur_id);
    const vehicule = await Vehicule.findById(trajet.vehicule_id);
    console.log("backend a voir ",chauffeur);
    if (chauffeur) {
      await Chauffeur.findByIdAndUpdate(chauffeur._id, { statut: "Disponible" });
    }

    if (vehicule) {
      await Vehicule.findByIdAndUpdate(vehicule._id, { statut: "Disponible" });
    }

    // Notifier les clients via Socket.IO
    io.emit("trajet:deleted", { id: req.params.id });

    res.status(200).json({ success: true, message: "Trajet supprimé", trajet });
  } catch (error) {
    next(new Errors("Erreur lors de la suppression du trajet", 400));
  }
}));


// DELETE MULTIPLE TRIPS
router.post(
  "/more",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      const response = await Trajet.deleteMany({ _id: { $in: req.body.ids } });
      res.status(200).json({ success: true, message: "Trajets supprimés avec succès", response });
    } catch (error) {
      next(new Errors("Erreur lors de la suppression des trajets", 400));
    }
  })
);

// DELETE A TRIP


// IMPORT TRIPS FROM EXCEL FILE
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
            A: "departureCity",
            B: "arrivalCity",
            C: "date",
            D: "tarif",
            E: "horaire",
            F: "vehicule_id",
            G: "chauffeur_id",
          },
        });
        const trajets = await Promise.all(
          data.map(async (d) => {
            const trajet = new Trajet(d);
            return await trajet.save();
          })
        );
        res.status(201).json({ success: true, message: "Trajets importés avec succès", trajets });
      });
    } catch (error) {
      next(new Errors("Erreur lors de l'importation des trajets", 400));
    }
  })
);

module.exports = router;
