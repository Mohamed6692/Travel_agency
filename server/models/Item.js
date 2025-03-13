const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    logo: { type: String },
    name: { type: String },
    description: { type: String },
    content: { type: String },
    rate: { type: String },
    price: { type: String },
    android_file: { type: String },
    ios_file: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", schema);
