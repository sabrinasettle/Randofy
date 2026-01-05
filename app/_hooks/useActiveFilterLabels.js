import { useMemo } from "react";

const defaultFilters = {
  popularity: { min: 0.0, max: 1.0 },
  acoustics: { min: 0.0, max: 1.0 },
  energy: { min: 0.0, max: 1.0 },
  vocals: { min: 0.0, max: 1.0 },
  danceability: { min: 0.0, max: 1.0 },
  mood: { min: 0.0, max: 1.0 },
};

const filterPhrases = {
  popularity: ["Unknown", "Some Known", "Known", "Mostly Known", "Very Famous"],
  acoustics: [
    "All Electronic",
    "Mostly Electronic",
    "Mixed Sounds",
    "Mostly Acoustic",
    "All Acoustic",
  ],
  energy: ["Very Chill", "Chill", "Balanced", "Hype", "Very Hype"],
  vocals: [
    "No Vocals",
    "Few Vocals",
    "Some Vocals",
    "Vocal-Heavy",
    "Vocals Domainate",
  ],
  danceability: [
    "No Groove",
    "Low Groove",
    "Mid Groove",
    "Good Groove",
    "Dance Ready",
  ],
  mood: ["Somber Mood", "Mellow Mood", "Neutral Mood", "Upbeat", "Very Happy"],
};

function floatToIndex5(value) {
  const v = Math.min(1, Math.max(0, value));
  if (v < 0.2) return 0;
  if (v < 0.4) return 1;
  if (v < 0.6) return 2;
  if (v < 0.8) return 3;
  return 4;
}

function normalize01(x) {
  const n = typeof x === "string" ? Number(x) : x;
  if (!Number.isFinite(n)) return 0;
  return n > 1 ? n / 100 : n;
}

const eq = (a, b, eps = 1e-9) => Math.abs(a - b) < eps;

export function useActiveFilterLabels(filters) {
  return useMemo(() => {
    console.log(
      "useActiveFilterLabels RUN keys:",
      filters ? Object.keys(filters) : filters,
    );
    const labels = [];
    if (!filters) return labels;
    for (const key of Object.keys(defaultFilters)) {
      const current = filters[key];
      if (!current) {
        console.log("Missing key on filters:", key);
        continue;
      }
      const curMin = normalize01(current.min);
      const curMax = normalize01(current.max);

      if (key === "energy") {
        console.log("ENERGY raw:", current.max, "normalized:", curMax);
      }
      const defaults = defaultFilters[key];
      const isDefault = eq(curMin, defaults.min) && eq(curMax, defaults.max);
      if (isDefault) continue;

      const phrases = filterPhrases[key];
      // Use the midpoint of the range instead of just max
      const midpoint = (curMin + curMax) / 2;
      const idx = floatToIndex5(midpoint);
      labels.push(phrases[idx]);
    }
    return labels;
  }, [filters]);
}
