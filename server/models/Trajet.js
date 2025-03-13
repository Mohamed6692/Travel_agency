const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const trajet = new Schema(
    {
      origine: { type: String, required: true },
      destination: { type: String, required: true },
      distance: { type: Number, required: true },
      prix: { type: Number, required: true },
      horaire_depart: { type: String, required: true },
      horaire_arrivee: { type: String, required: true },
      type_transport: { type: String, enum: ["bus", "minibus", "taxi"], required: true },
      vehicule_id: { type: Schema.Types.ObjectId, ref: "Vehicule", required: true },
      chauffeur_id: { type: Schema.Types.ObjectId, ref: "Chauffeur", required: true },
      etat: { type: String, enum: ["Disponible", "Complet", "Annulé"], default: "Disponible" },
    },
    { timestamps: { createdAt: "date_creation", updatedAt: "date_modification" } }
  );
  
  module.exports = mongoose.model("Trajet", trajet);