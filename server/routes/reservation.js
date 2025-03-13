const express = require("express");
const { io } = require("../index"); 
const Reservation = require("../models/Reservation");
const auth = require("../middleware/auth");
const router = express.Router();
const formidable = require("formidable");
const excelToJson = require("convert-excel-to-json");
const Errors = require("../helpers/Errors");
const CatchAsyncError = require("../helpers/CatchAsyncError");

// CREATE A RESERVATION
router.post(
  "/create",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      const io = req.app.get("socketio");
      console.log("Données reçues :", req.body);
      const reservation = new Reservation(req.body);
      reservation.user = req.user._id;
      const response = await reservation.save();

      // Emit event for reservation creation
      io.emit("reservation:update", { type: "create", reservation: response });

      res.status(201).json({ 
        success: true,
        message: "Réservation créée avec succes , Veuillez rocedez au paiement",
        reservation: response,
      });
    } catch (error) {
      next(new Errors("Erreur lors de la création de la réservation", 400));
    }
  })
);


// 📌 Obtenir les sièges déjà réservés pour un trajet et une date donnée
router.get("/seatReservation", async (req, res) => {
  try {
    const { departureCity, arrivalCity, date } = req.query;

    if (!departureCity || !arrivalCity || !date) {
      return res.status(400).json({ success: false, message: "Tous les paramètres sont requis (departureCity, arrivalCity, date)." });
    }

    const reservations = await Reservation.find({ departureCity, arrivalCity, date }, "seatNumber").lean();

    const reservedSeats = reservations.map(reservation => reservation.seatNumber);

    res.json({ success: true, reservations: reservedSeats });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur lors de la récupération des réservations", error: error.message });
  }
});




// GET RESERVATIONS WITH SEARCH AND PAGINATION
router.get(
  "/search",
  CatchAsyncError(async (req, res, next) => {
    try {
      let keyword = req.query.q
        ? { departureCity: { $regex: req.query.q, $options: "i" } }
        : {};
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.size) || 5;
      const count = await Reservation.countDocuments({ ...keyword });
      const pages = Math.ceil(count / pageSize);
      const reservations = await Reservation.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort("-createdAt");
      res.status(200).json({ success: true, reservations, page, pages });
    } catch (error) {
      next(new Errors("Erreur lors de la récupération des réservations", 400));
    }
  })
);

// GET ALL RESERVATIONS
router.get(
  "/all",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      const io = req.app.get("socketio");

      // Récupérer les paramètres de pagination
      let page = parseInt(req.query.page) ;
      let limit = parseInt(req.query.limit) ;
      console.log("Page:", page, "Limit:", limit);
      let skip = (page - 1) * limit;

      // Récupérer le total des réservations
      let totalReservations = await Reservation.countDocuments();

      // Récupérer les réservations avec pagination
      let reservations = await Reservation.find()
        .populate("user", "firstName lastName")
        .skip(skip)
        .limit(limit);
        console.log("Nombre de réservations retournées:", reservations.length);

      io.emit("reservation:update", { type: "fetchAll", reservations });

      res.status(200).json({
        success: true,
        reservations,
        currentPage: page,
        totalPages: Math.ceil(totalReservations / limit),
        totalReservations
      });
      console.log("Total Reservations:", totalReservations, "Total Pages:", Math.ceil(totalReservations / limit));

    } catch (error) {
      next(new Errors("Erreur lors de la récupération des réservations", 400));
    }
  })
);


// GET A SINGLE RESERVATION
router.get(
  "/:id",
  CatchAsyncError(async (req, res, next) => {
    try {
      const reservation = await Reservation.findById(req.params.id);
      if (!reservation) return next(new Errors("Réservation non trouvée", 404));
      res.status(200).json({ success: true, reservation });
    } catch (error) {
      next(new Errors("Erreur lors de la récupération de la réservation", 400));
    }
  })
);

// UPDATE A RESERVATION
router.put(
  "/:id",
  CatchAsyncError(async (req, res, next) => {
    try {
      const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!reservation) return next(new Errors("Réservation non trouvée", 404));

      // Emit event for reservation update
      const io = req.app.get("socketio");
      io.emit("reservation:update", { type: "update", reservation });

      res.status(200).json({ success: true, message: "Paiement effectuer avec success", reservation });
    } catch (error) {
      next(new Errors("Erreur lors de la modification de la réservation", 400));
    }
  })
);

// DELETE A RESERVATION
router.delete(
  "/:id",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      const reservation = await Reservation.findByIdAndDelete(req.params.id);
      if (!reservation) return next(new Errors("Réservation non trouvée", 404));

      // Emit event for reservation deletion
      const io = req.app.get("socketio");
      io.emit("reservation:update", { type: "delete", id: req.params.id });

      res.status(200).json({ success: true, message: "Réservation supprimée", reservation });
    } catch (error) {
      next(new Errors("Erreur lors de la suppression de la réservation", 400));
    }
  })
);

// DELETE MULTIPLE RESERVATIONS
router.post(
  "/more",
  CatchAsyncError(async (req, res, next) => {
    try {
      const response = await Reservation.deleteMany({ _id: { $in: req.body.ids } });
      
      // Emit event for multiple deletions
      const io = req.app.get("socketio");
      io.emit("reservation:update", { type: "delete", ids: req.body.ids });

      res.status(200).json({ success: true, message: "Réservations supprimées avec succès", response });
    } catch (error) {
      next(new Errors("Erreur lors de la suppression des réservations", 400));
    }
  })
);

// IMPORT RESERVATIONS FROM EXCEL FILE
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
            F: "seatNumber",
          },
        });
        const reservations = await Promise.all(
          data.map(async (d) => {
            const reservation = new Reservation(d);
            reservation.user = req.user._id;
            return await reservation.save();
          })
        );

        // Emit event for import completion
        const io = req.app.get("socketio");
        io.emit("reservation:update", { type: "import", reservations });

        res.status(201).json({ success: true, message: "Réservations importées avec succès", reservations });
      });
    } catch (error) {
      next(new Errors("Erreur lors de l'importation des réservations", 400));
    }
  })
);

module.exports = router;
