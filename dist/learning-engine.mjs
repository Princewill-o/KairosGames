export const tokenize = (text, mode) =>
  mode === "growth"
    ? text.split(" ")
    : text.split(" ").reduce((a, w, i) => {
        if (i % 3 === 0) a.push(w);
        else a[a.length - 1] += " " + w;
        return a;
      }, []);
export const gradeOrder = (expected, actual) =>
  expected.map((x, i) => x === actual[i]);
export const scoreRun = (mistakes, seconds, mode) =>
  Math.max(
    0,
    Math.min(
      100,
      100 - mistakes * 5 - (mode === "growth" ? Math.floor(seconds / 12) : 0),
    ),
  );
export const freshProgress = () => ({
  games: {},
  mastered: [],
  streak: 0,
  lastDay: null,
  runs: 0,
  garden: {},
  journal: [],
});
export function recordCompletion(p, id, score, verses, day) {
  const previous = p.lastDay ? Date.parse(p.lastDay) : 0;
  const diff = Math.round((Date.parse(day) - previous) / 86400000);
  return {
    ...p,
    games: {
      ...p.games,
      [id]: {
        best: Math.max(p.games[id]?.best || 0, score),
        plays: (p.games[id]?.plays || 0) + 1,
      },
    },
    mastered: [...new Set([...p.mastered, ...verses])],
    streak: p.lastDay === day ? p.streak : diff === 1 ? p.streak + 1 : 1,
    lastDay: day,
    runs: p.runs + 1,
  };
}
export const gardenGrowth = (garden, chosen, correct) =>
  chosen === correct
    ? { ...garden, [chosen]: Math.min(3, (garden[chosen] || 0) + 1) }
    : { ...garden };
export function psalmBlanks(v, pass) {
  const words = v.text.split(" ");
  const keys = words
    .map((w, i) =>
      v.keywords.includes(w.toLowerCase().replace(/[^a-z]/g, "")) ? i : -1,
    )
    .filter((i) => i >= 0);
  const rest = words.map((_, i) => i).filter((i) => !keys.includes(i));
  return [...keys, ...rest]
    .slice(0, Math.min(words.length, pass === 1 ? 1 : pass === 2 ? 2 : 4))
    .sort((a, b) => a - b);
}
export function shuffle(items) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
