export const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const fakeData = Array.from({ length: 15 }, (_, idx) => ({
  id: idx,
  text: Math.random().toString(36).substring(7),
}));
