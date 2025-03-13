const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chauffeur = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User"}, // Référence au compte utilisateur
    nom: { type: String, required: true }, // Nom du chauffeur
    prenom: { type: String, required: true }, // Prénom du chauffeur
    permis_numero: { type: String, required: true }, // Numéro du permis de conduire
    experience: { type: Number, required: true }, // Années d'expérience
    numero_tel: { type: String, required: true, unique: true }, // Numéro de téléphone (unique)
    documents: { 
      cin: { type: String, unique: true }, // Carte d'identité nationale (unique)
      passeport: { type: String,unique:true } // Passeport (facultatif)
    },
    statut: { 
      type: String, 
      enum: ['Disponible', 'En service', 'En repos'], // Statut actuel du chauffeur
      default: 'Disponible'
    },
    date_ajout: { type: Date, default: Date.now, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chauffeur", chauffeur);