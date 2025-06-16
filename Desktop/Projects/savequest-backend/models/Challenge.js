const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["save_5k", "10_day_streak"],
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
  },
  target: {
    type: Number,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Challenge", ChallengeSchema);