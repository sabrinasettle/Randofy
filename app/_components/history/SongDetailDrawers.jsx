import { ArrowUp, ArrowDown, X } from "lucide-react";

export default function Drawers() {
  return (
    <div className="justify-end">
      <div id="song_details">
        <button
          onClick={() => setOpenSection("song details")}
          className="group w-full h-12 hover:text-gray-700 border-t border-gray-200 flex items-center justify-between px-0 transition-colors"
        >
          <span className="text-gray-700">
            Song Details{" "}
            {/* {changedSongDetailsCount !== 0 && (
                      <span>[{changedSongDetailsCount}]</span>
                    )} */}
          </span>
          <ArrowUp
            size={20}
            className="text-gray-500 group-hover:text-gray-700 transition-colors"
          />
        </button>

        {openSection === "song details" && (
          <div className="overflow-hidden transition-all duration-500 ease-out">
            <div className="py-4">
              <RadarChart
                data={{
                  popularity: song.popularity,
                  acoustics: song.acoustics,
                  energy: song.energy,
                  vocals: song.vocals,
                  danceability: song.danceability,
                  mood: song.mood,
                }}
                size={280}
              />
            </div>
          </div>
        )}
      </div>
      <div id="genres">
        <button
          // onClick={() => navigateToPanel("songDetails")}
          className="group w-full h-12 hover:text-gray-700 border-t border-gray-200 flex items-center justify-between px-0 transition-colors"
        >
          <span className="text-gray-700">Genres</span>
          <ArrowUp
            size={20}
            className="text-gray-500 group-hover:text-gray-700 transition-colors"
          />
        </button>
      </div>
    </div>
  );
}
