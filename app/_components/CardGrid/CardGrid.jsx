import { useGridContext } from "../../context/card-layout-context";
import SongCard from "../SongCard/SongCard";

export default function CardGrid({ songs }) {
  const { layoutContext } = useGridContext();

  const layout = layoutContext.layoutType;
  let imageSize = 189;

  function updateClassName() {
    // oblong-grid, square-grid, list
    if (layout === "square-grid") {
      return "song-list song-list__grid song-list__history";
      imageSize = 189;
    }
    return "song-grid";
  }

  let layoutClass = updateClassName();

  return (
    <ul className={`${layoutClass}`}>
      {songs.map((song, index) => (
        // set size to 168
        // <div onClick={() => setSong(song)}>
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
