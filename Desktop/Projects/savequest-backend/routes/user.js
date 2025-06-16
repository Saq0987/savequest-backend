const express = require("express");
const router = express.Router();
const auth = require("../middleware/authmiddleware");
const User = require("../models/user");

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

module.exports = router;