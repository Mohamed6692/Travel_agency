const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ville = new Schema(
  {
    nom: { type: String, required: true, unique: true },
    date_ajout: { type: Date, default: Date.now, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ville", ville);
