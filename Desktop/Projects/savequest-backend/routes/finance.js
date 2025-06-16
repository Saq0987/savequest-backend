const express = require("express");
const router = express.Router();
const auth = require("../middleware/authmiddleware");
const Finance = require("../models/finance");

// @route   POST /api/finance
// @desc    Add income or expense
router.post("/", auth, async (req, res) => {
  const { type, amount, description } = req.body;

  try {
    const newRecord = new Finance({
      user: req.user.id,
      type,
      amount,
      description,
    });

    const saved = await newRecord.save();
    res.json(saved);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/finance
// @desc    Get all transactions for logged in user
router.get("/", auth, async (req, res) => {
  try {
    const transactions = await Finance.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/finance/:id
// @desc    Delete a transaction
router.delete("/:id", auth, async (req, res) => {
  try {
    const transaction = await Finance.findById(req.params.id);

    if (!transaction) return res.status(404).json({ msg: "Transaction not found" });

    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    await transaction.remove();
    res.json({ msg: "Transaction deleted" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;