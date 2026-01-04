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
    "All Electric",
    "Mostly Electric",
    "Mixed Acoustics",
    "Mostly Acoustic",
    "All Acoustic",
  ],
  energy: ["Very Chill", "Chill", "Balanced", "Hype", "Very Hype"],
  vocals: [
    "No Vocals",
    "Few Vocals",
    "Some Vocals",
    "Lots Vocals",
    "All Vocals",
  ],
  danceability: [
    "No Groove",
    "Low Groove",
    "Mid Groove",
    "Good Groove",
    "Dance Ready",
  ],
  mood: ["Very Low", "Low", "Neutral", "High", "Very High"],
};

function floatToIndex5(value) {
  const v = Math.min(1, Math.max(0, value));

  if (v <= 0) return 0; // 0%
  if (v <= 0.25) return 1; // 25%
  if (v <= 0.5) return 2; // 50%
  if (v <= 0.75) return 3; // 75%
  return 4; // 100%
}

const eq = (a, b, eps = 1e-9) => Math.abs(a - b) < eps;

export function useActiveFilterLabels(filters) {
  return useMemo(() => {
    const labels = [];
    if (!filters) return labels;

    for (const key of Object.keys(defaultFilters)) {
      const current = filters[key];
      const defaults = defaultFilters[key];
      if (!current) continue;

      const isDefault =
        eq(current.min, defaults.min) && eq(current.max, defaults.max);
      if (isDefault) continue;

      const phrases = filterPhrases[key];
      if (!phrases) continue;

      const idx = floatToIndex5(current.max);
      const phrase = phrases[idx];
      if (phrase) labels.push(phrase);
    }

    return labels;
  }, [filters]);
}
