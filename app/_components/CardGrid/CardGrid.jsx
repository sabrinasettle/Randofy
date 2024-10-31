import { useGridContext } from "../../context/card-layout-context";
import SongCard from "../SongCard/SongCard";

export default function CardGrid({ songs }) {
  const { layoutContext } = useGridContext();

  const layout = layoutContext.layoutType;
  let imageSize = 189;

  function updateClassName() {
    // oblong-grid, square-grid, list
    if (layout === "square-grid") {
      imageSize = 170;
      return "song-list song-list__grid song-list__history";
    }
    if (layout === "oblong-grid") {
      imageSize = 298;
      return "song-list song-list__oblong-grid song-list__history";
    }
    if (layout === "list-grid") {
      imageSize = 100;
      return "song-list song-list__list-grid song-list__history";
    }
    return "song-list";
  }

  let layoutClass = updateClassName();
  // let arrayReversed = songs.reverse();

  function reverseArr(input) {
    var ret = new Array();
    for (var i = input.length - 1; i >= 0; i--) {
      ret.push(input[i]);
    }
    return ret;
  }

  let reversedSongs = reverseArr(songs);

  return (
    <ul className={`${layoutClass}`}>
      {reversedSongs.map((song, index) => (
        <SongCard
          song={song}
          index={index}
          scrollTo
          songIsActive
          key={`song ` + `${song.track_name}`}
          imageSize={imageSize}
        />
        // </div>
      ))}
    </ul>
  );
}
