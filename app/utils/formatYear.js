export function formatYear(song) {
  const yearRegex = /^\d{4}/;
  const match = song.release_year.match(yearRegex);
  return match ? match[0] : null;
}
