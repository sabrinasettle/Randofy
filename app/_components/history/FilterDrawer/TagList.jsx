import { X } from "lucide-react";

export default function TagList({
  items,
  onRemove,
  valueStrings = {},
  className = "",
  defaultFilters = {}, // Add defaultFilters prop for song details
}) {
  if (!items) {
    return null;
  }

  const tagEntries = [];

  // Handle Set<string> (genres)
  if (items instanceof Set) {
    for (const tag of items) {
      tagEntries.push({
        key: tag,
        label: prettify(tag),
        removeValue: tag, // Pass the string directly
      });
    }
  } else {
    // Handle Record<string, { min, max }> (song details)
    // Only show filters that have changed from defaults
    for (const [key, { min, max }] of Object.entries(items)) {
      // Skip if this filter hasn't changed from default
      if (defaultFilters[key]) {
        const defaultRange = defaultFilters[key];
        if (min === defaultRange.min && max === defaultRange.max) {
          continue; // Skip unchanged filters
        }
      }

      const rangeLabels = valueStrings[key];
      let label;

      if (rangeLabels && rangeLabels.length === 4) {
        const minLabel = rangeLabels[getBucketIndex(min)];
        const maxLabel = rangeLabels[getBucketIndex(max)];
        label =
          min === max
            ? `${prettify(key)}: ${minLabel}`
            : `${prettify(key)}: ${minLabel} – ${maxLabel}`;
      } else {
        label = `${prettify(key)}: ${min} – ${max}`;
      }

      tagEntries.push({
        key,
        label,
        removeValue: key, // Pass the key (filter name) for song details
      });
    }
  }

  // Return null if no tags to show after filtering
  if (tagEntries.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 mt-2 ${className}`}>
      {tagEntries.map(({ key, label, removeValue }, index) => (
        <div
          key={index}
          className="group inline-flex items-center gap-2 pl-2 pr-1 py-1 border border-gray-300 hover:border-gray-700 rounded-md"
        >
          <span className="font-body text-body-md text-gray-600 group-hover:text-gray-700">
            {label}
          </span>
          <button
            onClick={() => onRemove(removeValue)}
            className="text-gray-600 group-hover:text-gray-700 rounded-full transition-colors"
            aria-label={`Remove ${label}`}
          >
            <X size={20} />
          </button>
        </div>
      ))}
    </div>
  );
}

// Buckets: [0–0.25), [0.25–0.5), [0.5–0.75), [0.75–1.0]
function getBucketIndex(value) {
  if (value < 0.25) return 0;
  if (value < 0.5) return 1;
  if (value < 0.75) return 2;
  return 3;
}

// Turns 'dance-party' into 'Dance Party'
function prettify(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
