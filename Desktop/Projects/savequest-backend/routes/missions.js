const express = require("express");
const router = express.Router();
const auth = require("../middleware/authmiddleware");
const Mission = require("../models/Mission");
const Challenge = require("../models/Challenge");
const User = require("../models/user");

// 🟢 Get Daily Mission (one per day)
router.get("/daily", auth, async (req, res) => {
  const today = new Date().toDateString();

  let mission = await Mission.findOne({
    user: req.user.id,
    title: "No Spend Day",
    date: { $gte: new Date(today) }
  });

  if (!mission) {
    mission = new Mission({ user: req.user.id, title: "No Spend Day" });
    await mission.save();
  }

  res.json(mission);
});

// 🟢 Complete Daily Mission
router.post("/complete-daily", auth, async (req, res) => {
  const mission = await Mission.findOne({
    user: req.user.id,
    title: "No Spend Day",
    completed: false,
  });

  if (!mission) return res.status(400).json({ msg: "No active mission" });

  mission.completed = true;
  await mission.save();

  // Reward XP
  const user = await User.findById(req.user.id);
  user.xp += mission.xpReward;
  await user.save();

  res.json({ msg: "Mission completed", xp: user.xp });
});

// 🟡 Get All Challenges
router.get("/challenges", auth, async (req, res) => {
  const challenges = await Challenge.find({ user: req.user.id });
  res.json(challenges);
});

// 🟡 Create Default Challenges (Run this once after signup)
router.post("/init-challenges", auth, async (req, res) => {
  const existing = await Challenge.find({ user: req.user.id });
  if (existing.length > 0) return res.status(400).json({ msg: "Challenges already initialized" });

  const challenges = [
    { type: "save_5k", target: 5000 },
    { type: "10_day_streak", target: 10 },
  ];

  const created = await Challenge.insertMany(
    challenges.map(c => ({
      user: req.user.id,
      type: c.type,
      target: c.target,
    }))
  );

  res.json(created);
});

// 🟡 Update Challenge Progress
router.post("/update-challenge", auth, async (req, res) => {
  const { type, value } = req.body;
  const challenge = await Challenge.findOne({ user: req.user.id, type });

  if (!challenge || challenge.completed) return res.status(400).json({ msg: "Invalid challenge" });

  challenge.progress += value;
  if (challenge.progress >= challenge.target) {
    challenge.completed = true;
    challenge.progress = challenge.target;
  }

  await challenge.save();
  res.json(challenge);
});

module.exports = router;