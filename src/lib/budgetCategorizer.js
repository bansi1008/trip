// lib/budgetCategorizer.js

const countryCostOfLivingIndex = {
  "United States": 100,
  Canada: 78,
  "United Kingdom": 70,
  France: 75,
  Germany: 72,
  Australia: 75,
  India: 25,
  China: 40,
  Japan: 83,
  "South Korea": 68,
  Brazil: 44,
  Mexico: 35,
  Russia: 40,
  "South Africa": 50,
  Egypt: 30,
  Turkey: 38,
  "United Arab Emirates": 65,
  "Saudi Arabia": 45,
  Thailand: 32,
  Vietnam: 28,
  Philippines: 30,
  Indonesia: 26,
  Malaysia: 40,
  Singapore: 85,
  "New Zealand": 73,
  Italy: 70,
  Spain: 65,
  Netherlands: 70,
  Sweden: 75,
  Switzerland: 122,
};

const baseThresholdsUSD = {
  low: 30,
  moderate: 70,
  luxury: 150,
  ultraLuxury: 400,
};

function getBudgetCategory(country, dailyBudget) {
  const colIndex = countryCostOfLivingIndex[country] || 50; // fallback if unknown country
  const multiplier = colIndex / 100;
  console.log(country, dailyBudget);

  const thresholds = Object.fromEntries(
    Object.entries(baseThresholdsUSD).map(([k, v]) => [k, v / multiplier])
  );

  if (dailyBudget < thresholds.low) return "very low";
  if (dailyBudget < thresholds.moderate) return "low";
  if (dailyBudget < thresholds.luxury) return "moderate";
  if (dailyBudget < thresholds.ultraLuxury) return "luxury";
  return "ultra luxury";
}

module.exports = {
  getBudgetCategory,
};
