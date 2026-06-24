export const birthdayMessages = [
  "And He found you lost and guided you. (93:7) – Happy birthday! May you always be guided.",
  "So verily, with the hardship, there is relief. (94:6) – Wishing you a year full of relief and joy.",
  "My mercy encompasses all things. (7:156) – May this year be filled with Allah’s mercy.",
  "And whoever relies upon Allah – then He is sufficient for him. (65:3) – You are never alone. Happy birthday!",
  "Indeed, Allah is with the patient. (2:153) – May your patience be rewarded abundantly this year.",
  "And your Lord is going to give you, and you will be satisfied. (93:5) – A beautiful year ahead, insha’Allah!",
  "Call upon Me; I will respond to you. (40:60) – Every prayer of yours is heard. Stay blessed.",
  "He created you in the best of forms. (95:4) – Celebrate the unique, wonderful person you are.",
  "Another year, another chapter. You’ve come so far – keep shining! 🌟",
  "May this year bring you closer to your dreams, no matter where you are in the world. 🎈",
  "Birthdays are milestones of courage. Look back and smile – you’ve survived 100% of your bad days. ❤️",
  "You are a light to those around you. Keep glowing. Happy birthday!",
  "On this day, the universe received a gift – you. Never forget your worth.",
  "May your journey be filled with peace, love, and countless adventures. Happy birthday, wanderer!",
  "Every year you grow stronger and wiser. Keep going, the best is yet to come.",
  "Today is a celebration of you – your resilience, your kindness, your existence. We’re glad you’re here."
];

export function getRandomBirthdayMessage() {
  const randomIndex = Math.floor(Math.random() * birthdayMessages.length);
  return birthdayMessages[randomIndex];
}