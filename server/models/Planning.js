const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const joursSemaineEnum = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

const planningSchema = new Schema(
  {
    jour: {
      type: String,
      enum: joursSemaineEnum,
      required: true,
    },
    trajets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Trajet", // Assure-toi que "Trajet" est bien défini dans ton projet
      },
    ],
  },
  { timestamps: { createdAt: "date_creation", updatedAt: "date_modification" } }
);

module.exports = mongoose.model("Planning", planningSchema);
