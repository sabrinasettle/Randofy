import { useGridContext } from "../../context/card-layout-context";
import SongCard from "./SongCard";

export default function CardGrid({ songs }) {
  const { layoutContext } = useGridContext();
  const layout = layoutContext.layoutType;

  function reverseArr(input) {
    var ret = new Array();
    for (var i = input.length - 1; i >= 0; i--) {
      ret.push(input[i]);
    }
    return ret;
  }

  let reversedSongs = reverseArr(songs);

  // Updated to use grid for square layout to give proper sizing constraints
  const list =
    layout === "list-grid"
      ? "flex flex-col"
      : "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";

  return (
    <ul className={list}>
      {reversedSongs.map((song, index) => (
        <SongCard
          song={song}
          index={index}
          scrollTo
          key={`song ` + `${song.track_name} + ${index}`}
        />
      ))}
    </ul>
  );
}
