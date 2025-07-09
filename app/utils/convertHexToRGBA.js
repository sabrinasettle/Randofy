export function hexToRGBA(hex, opacity) {
  if (hex && hex.constructor !== Array) {
    // console.log(hex, hex === undefined, !hex);
    // Remove the '#' if present
    hex = hex.replace("#", "");

    // Convert the hex values to decimal
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Return the RGBA string
    // console.log(`${r}, ${g}, ${b}, ${opacity}`);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  // if (!hex || hex === undefined || hex !== String) return "";
  return `rgba(0, 0, 0, ${opacity})`;
}
