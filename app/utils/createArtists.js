export function createArtists(song) {
  let artistArray = [];
  let len = song.track_artists.length;
  song.track_artists.map((item) => {
    artistArray.push(item.name);
  });

  let artistString = "";
  for (let i = 0; i < len; i++) {
    if ((i === 0 && i == len - 1) || i == len - 1) {
      artistString += artistArray[i];
    } else if (i !== len - 1) {
      artistString += artistArray[i] + ", ";
    }
  }

  return artistString;
}
