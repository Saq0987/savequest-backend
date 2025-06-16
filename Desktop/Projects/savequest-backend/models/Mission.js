const mongoose = require("mongoose");

const MissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    enum: ["No Spend Day"],
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  xpReward: {
    type: Number,
    default: 50,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Mission", MissionSchema);