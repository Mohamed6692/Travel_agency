const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationSchema = new Schema(
  {
    departureCity: { type: String, required: true },
    arrivalCity: { type: String, required: true },
    date: { type: Date, required: true },
    tarif: { type: Number, required: true },
    horaire: { type: String, required: true },
    seatNumber: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dateReservation: { type: Date, required: true, default: Date.now },
    paymentStatus: { type: String, required: true },
  },
  { timestamps: true }
);

// Empêcher qu'un même siège soit réservé plusieurs fois sur une même date et trajet
reservationSchema.index(
  { departureCity: 1, arrivalCity: 1, date: 1, seatNumber: 1 },
  { unique: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
