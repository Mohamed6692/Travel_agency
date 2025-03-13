const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const vehiculeSchema = new Schema(
  {
    immatriculation: { type: String, required: true, unique: true },
    marque: { type: String, required: true },
    modele: { type: String, required: true },
    capacite: { type: Number, required: true },
    statut: {
      type: String,
      enum: ["Disponible", "En maintenance", "Hors service", "Nom disponible"],
      default: "Disponible",
      required: true,
    },
    chauffeur_id: { type: Schema.Types.ObjectId, ref: "User", required: false },
    date_ajout: { type: Date, default: Date.now, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicule", vehiculeSchema);