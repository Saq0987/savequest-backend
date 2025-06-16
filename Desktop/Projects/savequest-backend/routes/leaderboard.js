const express = require("express");
const router = express.Router();
const User = require("../models/user");

// 🏆 GET Top 10 Users by XP
router.get("/", async (req, res) => {
  try {
    const topUsers = await User.find()
      .select("username xp level")
      .sort({ xp: -1 })
      .limit(10);

    res.json(topUsers);
  } catch (err) {
    res.status(500).json({ error: "Leaderboard fetch failed" });
  }
});

module.exports = router;