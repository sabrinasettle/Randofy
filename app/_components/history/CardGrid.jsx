import { useGridContext } from "../../context/card-layout-context";
import SongCard from "./SongCard";

export default function CardGrid({ songs }) {
  const { layoutContext } = useGridContext();

  const layout = layoutContext.layoutType;

  // let arrayReversed = songs.reverse();

  function reverseArr(input) {
    var ret = new Array();
    for (var i = input.length - 1; i >= 0; i--) {
      ret.push(input[i]);
    }
    return ret;
  }

  let reversedSongs = reverseArr(songs);

  const list =
    layout === "list-grid" ? "flex flex-col" : "flex flex-row flex-wrap gap-3";

  return (
    <ul className={list}>
      {reversedSongs.map((song, index) => (
        <SongCard
          song={song}
          index={index}
          scrollTo
          songIsActive
          key={`song ` + `${song.track_name}`}
        />
      ))}
    </ul>
  );
}
