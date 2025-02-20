const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stationId: { type: String, required: true }, // Assuming station ID is a string
  stationName: { type: String, required: true },
  location: { type: String, required: true },
});

const Favorite = mongoose.model("Favorite", FavoriteSchema);
module.exports = Favorite;
