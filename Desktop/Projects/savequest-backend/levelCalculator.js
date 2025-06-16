function getLevelFromXP(xp) {
  if (xp >= 2000) return "Wealth Master";
  if (xp >= 1500) return "Financial Wizard";
  if (xp >= 1000) return "Expense Expert";
  if (xp >= 500) return "Saving Starter";
  if (xp >= 200) return "Budget Beginner";
  return "Newbie";
}

module.exports = getLevelFromXP;