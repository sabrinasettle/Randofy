import { useMemo } from "react";

// Assumes you already have this utility
export function hexToRGBA(hex, opacity) {
  if (hex && hex.constructor !== Array) {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return `rgba(0, 0, 0, ${opacity})`;
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function luminance({ r, g, b }) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrast(hex1, hex2) {
  const lum1 = luminance(hexToRgb(hex1));
  const lum2 = luminance(hexToRgb(hex2));
  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}

/**
 * Returns a hex alpha suffix based on whether the color is accessible
 * with gray-600 or gray-700. Use this to set the opacity of your radial center color.
 */
export function useAccessibleAlpha(promColor) {
  return useMemo(() => {
    const gray700 = "#E5E5E5";
    const gray600 = "#B2B2B2";

    const meetsContrast =
      contrast(promColor, gray700) >= 4.5 ||
      contrast(promColor, gray600) >= 4.5;

    return meetsContrast ? "cc" : "33"; // 80% or 30%
  }, [promColor]);
}

// | Opacity | Hex Suffix |
// | ------- | ---------- |
// | 100%    | `FF`       |
// | 90%     | `E6`       |
// | 80%     | `CC`       |
// | **70%** | **`B3`** ✅ |
// | 60%     | `99`       |
// | 50%     | `80`       |
