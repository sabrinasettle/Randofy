import { useState, useEffect, useMemo } from "react";
import { ChevronRight, ArrowLeft, X } from "lucide-react";
import DoubleEndedSlider from "../../ui/DoubleEndedSlider";
import GenresSection from "./GenresSection";
import { useSpotifyContext } from "../../../context/spotify-context";

// const Genres = ({ navigateBack, selectedGenres, setSelectedGenres }) => {
//   const genres = [
//     "acoustic",
//     "afrobeat",
//     "alt-rock",
//     "alternative",
//     "ambient",
//     "anime",
//     "black-metal",
//     "bluegrass",
//     "blues",
//     "bossanova",
//     "brazil",
//     "breakbeat",
//     "british",
//     "cantopop",
//     "chicago-house",
//     "children",
//     "chill",
//     "classical",
//     "club",
//     "comedy",
//     "country",
//     "dance",
//     "dancehall",
//     "death-metal",
//     "deep-house",
//     "detroit-techno",
//     "disco",
//     "disney",
//     "drum-and-bass",
//     "dub",
//     "dubstep",
//     "edm",
//     "electro",
//     "electronic",
//     "emo",
//     "folk",
//     "forro",
//     "french",
//     "funk",
//     "garage",
//     "german",
//     "gospel",
//     "goth",
//     "grindcore",
//     "groove",
//     "grunge",
//     "guitar",
//     "happy",
//     "hard-rock",
//     "hardcore",
//     "hardstyle",
//     "heavy-metal",
//     "hip-hop",
//     "holidays",
//     "honky-tonk",
//     "house",
//     "idm",
//     "indian",
//     "indie",
//     "indie-pop",
//     "industrial",
//     "iranian",
//     "j-dance",
//     "j-idol",
//     "j-pop",
//     "j-rock",
//     "jazz",
//     "k-pop",
//     "kids",
//     "latin",
//     "latino",
//     "malay",
//     "mandopop",
//     "metal",
//     "metal-misc",
//     "metalcore",
//     "minimal-techno",
//     "movies",
//     "mpb",
//     "new-age",
//     "new-release",
//     "opera",
//     "pagode",
//     "party",
//     "philippines-opm",
//     "piano",
//     "pop",
//     "pop-film",
//     "post-dubstep",
//     "power-pop",
//     "progressive-house",
//     "psych-rock",
//     "punk",
//     "punk-rock",
//     "r-n-b",
//     "rainy-day",
//     "reggae",
//     "reggaeton",
//     "road-trip",
//     "rock",
//     "rock-n-roll",
//     "rockabilly",
//     "romance",
//     "sad",
//     "salsa",
//     "samba",
//     "sertanejo",
//     "show-tunes",
//     "singer-songwriter",
//     "ska",
//     "sleep",
//     "songwriter",
//     "soul",
//     "soundtracks",
//     "spanish",
//     "study",
//     "summer",
//     "swedish",
//     "synth-pop",
//     "tango",
//     "techno",
//     "trance",
//     "trip-hop",
//     "turkish",
//     "work-out",
//     "world-music",
//   ];

//   // Group genres by first letter - memoized since genres array is static
//   const { groupedGenres, sortedLetters } = useMemo(() => {
//     const grouped = genres.reduce((acc, genre) => {
//       const firstLetter = genre[0].toUpperCase();
//       if (!acc[firstLetter]) {
//         acc[firstLetter] = [];
//       }
//       acc[firstLetter].push(genre);
//       return acc;
//     }, {});

//     return {
//       groupedGenres: grouped,
//       sortedLetters: Object.keys(grouped).sort(),
//     };
//   }, []);

//   const toggleGenre = (genre) => {
//     const newSelected = new Set(selectedGenres);
//     if (newSelected.has(genre)) {
//       newSelected.delete(genre);
//     } else {
//       newSelected.add(genre);
//     }
//     setSelectedGenres(newSelected);
//   };

//   // Memoize the selected count calculations to avoid recalculating on each render
//   const sectionSelectedCounts = useMemo(() => {
//     const counts = {};
//     sortedLetters.forEach((letter) => {
//       counts[letter] = groupedGenres[letter].filter((genre) =>
//         selectedGenres.has(genre),
//       ).length;
//     });
//     return counts;
//   }, [selectedGenres, groupedGenres, sortedLetters]);

//   // Memoize the sorted selected genres array
//   const sortedSelectedGenres = useMemo(() => {
//     return Array.from(selectedGenres).sort();
//   }, [selectedGenres]);

//   const formatGenreName = useMemo(() => {
//     const cache = {};
//     return (genre) => {
//       if (!cache[genre]) {
//         cache[genre] = genre
//           .split("-")
//           .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//           .join(" ");
//       }
//       return cache[genre];
//     };
//   }, []);

//   return (
//     <>
//       <div className="p-4 flex flex-row justify-between">
//         <button
//           onClick={navigateBack}
//           className="flex items-center gap-4 text-gray-400 hover:text-white"
//         >
//           <ArrowLeft size={20} />
//           <h1 className="text-white text-lg font-medium">Genres</h1>
//         </button>
//         {selectedGenres.size === 0 ? (
//           <span className="font-semibold text-gray-600">
//             [{selectedGenres.size}]
//           </span>
//         ) : (
//           <span className="font-semibold text-blue-600">
//             [{selectedGenres.size}]
//           </span>
//         )}
//       </div>
//       {/* Content */}
//       <div className="flex-1 px-4">
//         <p className="text-body-sm text-gray-500 text-balance">
//           Disclaimer: *While Spotify identifies and works with thousands of
//           subgenres these are the available genres to search against
//         </p>
//         {/* Alpha lists of the genres */}
//         <div className="space-y-6">
//           {sortedLetters.map((letter) => (
//             <div key={letter} className="pt-4">
//               <div className="flex items-center justify-between pb-1 mb-3 border-b border-gray-500">
//                 <h2 className="text-body-sm font-normal text-gray-800 flex items-center pl-2">
//                   {letter.toUpperCase()}
//                 </h2>
//                 <div className="text-gray-700 text-sm font-medium">
//                   [{sectionSelectedCounts[letter]}]
//                 </div>
//               </div>

//               <div className="flex flex-col gap-2">
//                 {groupedGenres[letter].map((genre) => (
//                   <button
//                     key={genre}
//                     onClick={() => toggleGenre(genre)}
//                     className={`
//                               px-3 py-2 rounded-sm text-sm transition-all duration-200 text-left
//                               ${
//                                 selectedGenres.has(genre)
//                                   ? "font-semibold bg-gray-100 text-white shadow-md transform scale-101"
//                                   : "font-medium bg-gray-000 text-gray-600 hover:bg-gray-200 hover:text-gray-700 hover:shadow-sm"
//                               }
//                             `}
//                   >
//                     {formatGenreName(genre)}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

export default function FilterDrawer({ isOpen, onClose }) {
  const [activePanel, setActivePanel] = useState("main");
  const [sliderValue, setSliderValue] = useState(5);
  const [isVisible, setIsVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  // Filter states
  const [selectedGenres, setSelectedGenres] = useState(new Set());
  const [songDetailsFilters, setSongDetailsFilters] = useState({
    popularity: { min: 0.0, max: 1.0 },
    acoustics: { min: 0.0, max: 1.0 },
    energy: { min: 0.0, max: 1.0 },
    vocals: { min: 0.0, max: 1.0 },
    danceability: { min: 0.0, max: 1.0 },
    mood: { min: 0.0, max: 1.0 },
  });

  const { spotifyClient } = useSpotifyContext();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);

      // Ensure the drawer is rendered before transitioning
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimateIn(true);
        });
      });
    } else {
      setAnimateIn(false);

      // Delay unmount to let transition play
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 500); // matches transition duration

      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const handleSliderChange = (e) => {
    setSliderValue(parseInt(e.target.value));
    // update the filters through spotifyClient
  };

  const navigateToPanel = (panel) => {
    setActivePanel(panel);
  };

  const navigateBack = () => {
    setActivePanel("main");
  };

  const closeAndGet = () => {
    // spotifyClient.getSongs();
    onClose();
  };

  const clearFilters = () => {
    switch (activePanel) {
      case "genres":
        setSelectedGenres(new Set());
        break;
      case "songDetails":
        setSongDetailsFilters({
          popularity: { min: 0.0, max: 1.0 },
          acoustics: { min: 0.0, max: 1.0 },
          energy: { min: 0.0, max: 1.0 },
          vocals: { min: 0.0, max: 1.0 },
          danceability: { min: 0.0, max: 1.0 },
          mood: { min: 0.0, max: 1.0 },
        });
        break;
      case "main":
      default:
        // Clear all filters
        setSelectedGenres(new Set());
        setSongDetailsFilters({
          popularity: { min: 0.0, max: 1.0 },
          acoustics: { min: 0.0, max: 1.0 },
          energy: { min: 0.0, max: 1.0 },
          vocals: { min: 0.0, max: 1.0 },
          danceability: { min: 0.0, max: 1.0 },
          mood: { min: 0.0, max: 1.0 },
        });
        setSliderValue(5);
        break;
    }
  };

  const handleSongDetailsFilterChange = (filterName, range) => {
    setSongDetailsFilters((prev) => ({
      ...prev,
      [filterName]: range,
    }));
  };

  const changedSongDetailsCount = useMemo(() => {
    const defaultFilters = {
      popularity: { min: 0.0, max: 1.0 },
      acoustics: { min: 0.0, max: 1.0 },
      energy: { min: 0.0, max: 1.0 },
      vocals: { min: 0.0, max: 1.0 },
      danceability: { min: 0.0, max: 1.0 },
      mood: { min: 0.0, max: 1.0 },
    };

    return Object.keys(songDetailsFilters).filter((key) => {
      const current = songDetailsFilters[key];
      const defaultRange = defaultFilters[key];
      return (
        current.min !== defaultRange.min || current.max !== defaultRange.max
      );
    }).length;
  }, [songDetailsFilters]);

  // Views -------------------------------------------------------------------------------------------
  if (!isVisible) return null;

  const renderMainView = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <h1 className="text-gray-700 text-lg font-medium">Filter Songs</h1>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>
      {/* Content */}
      <div className="flex-1 p-4">
        {/* Random Songs Slider */}
        <div className="mb-8">
          <label
            htmlFor="custom-range"
            className="flex flex-row items-center gap-2 pb-3"
          >
            <div className="py-1 px-2 border border-gray-300 rounded-sm text-gray-700 text-heading-4 min-w-[3rem] text-center">
              {sliderValue}
            </div>
            <p className="text-gray-700 text-heading-4">Totally random songs</p>
          </label>

          <div className="relative">
            <input
              id="custom-range"
              type="range"
              min="5"
              max="100"
              value={sliderValue}
              onChange={handleSliderChange}
              className="w-full h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer  slider"
            />
            <style jsx>{`
              .slider::-webkit-slider-thumb {
                appearance: none;
                height: 16px;
                width: 16px;
                border-radius: 50%;
                background: #e5e5e5;
                cursor: pointer;
                border: none;
              }
              .slider::-moz-range-thumb {
                height: 16px;
                width: 16px;
                border-radius: 50%;
                background: #e5e5e5;
                cursor: pointer;
                border: none;
              }
              .slider {
                background: linear-gradient(
                  to right,
                  #b2b2b2 0%,
                  #b2b2b2 ${((sliderValue - 5) / 95) * 100}%,
                  #4b4b4b ${((sliderValue - 5) / 95) * 100}%,
                  #4b4b4b 100%
                );
              }
            `}</style>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="space-y-0">
          <button
            onClick={() => navigateToPanel("songDetails")}
            className="w-full h-12 border-t border-gray-200 flex items-center justify-between px-0 transition-colors"
          >
            <span className="text-gray-700">
              Song Details{" "}
              {changedSongDetailsCount !== 0 && (
                <span>[{changedSongDetailsCount}]</span>
              )}
            </span>
            <ChevronRight size={16} className="text-gray-500" />
          </button>

          <button
            onClick={() => navigateToPanel("genres")}
            className="w-full h-12 border-t border-gray-200 flex items-center justify-between px-0 transition-colors"
          >
            <span className="text-gray-700">
              Genres{" "}
              {selectedGenres.size !== 0 && (
                <span>[{selectedGenres.size}]</span>
              )}
            </span>
            <ChevronRight size={16} className="text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderSongDetails = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <button
        onClick={navigateBack}
        className="flex items-center gap-4 p-4 text-gray-400 hover:text-white"
      >
        <ArrowLeft size={20} />{" "}
        <h1 className="text-white text-lg font-medium">Song Details</h1>
      </button>
      {/* </div> */}

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <DoubleEndedSlider
          label="Popularity"
          min={0}
          max={1}
          defaultMin={songDetailsFilters.popularity.min}
          defaultMax={songDetailsFilters.popularity.max}
          formatValue={(v) =>
            v === 0.1
              ? "Small dive bars"
              : v === 0.9
                ? "Massive concerts"
                : `${(v * 100).toFixed(0)}%`
          }
          onChange={(range) =>
            handleSongDetailsFilterChange("popularity", range)
          }
        />

        <DoubleEndedSlider
          label="Acoustics"
          min={0}
          max={1}
          defaultMin={songDetailsFilters.acoustics.min}
          defaultMax={songDetailsFilters.acoustics.max}
          formatValue={(v) =>
            v === 0.2
              ? "Completely electronic"
              : v === 0.8
                ? "Totally acoustic"
                : `${(v * 100).toFixed(0)}%`
          }
          onChange={(range) =>
            handleSongDetailsFilterChange("acoustics", range)
          }
        />

        <DoubleEndedSlider
          label="Energy"
          min={0}
          max={1}
          defaultMin={songDetailsFilters.energy.min}
          defaultMax={songDetailsFilters.energy.max}
          formatValue={(v) =>
            v === 0.3
              ? "Low and Moody"
              : v === 0.7
                ? "High and Joyful"
                : `${(v * 100).toFixed(0)}%`
          }
          onChange={(range) => handleSongDetailsFilterChange("energy", range)}
        />

        <DoubleEndedSlider
          label="Vocals"
          min={0}
          max={1}
          defaultMin={songDetailsFilters.vocals.min}
          defaultMax={songDetailsFilters.vocals.max}
          formatValue={(v) =>
            v === 0.1
              ? "No vocals"
              : v === 0.9
                ? "Only vocals"
                : `${(v * 100).toFixed(0)}%`
          }
          onChange={(range) => handleSongDetailsFilterChange("vocals", range)}
        />

        <DoubleEndedSlider
          label="Danceability"
          min={0}
          max={1}
          defaultMin={songDetailsFilters.danceability.min}
          defaultMax={songDetailsFilters.danceability.max}
          formatValue={(v) =>
            v === 0.2
              ? "No rhythm"
              : v === 0.8
                ? "Made for dancing"
                : `${(v * 100).toFixed(0)}%`
          }
          onChange={(range) =>
            handleSongDetailsFilterChange("danceability", range)
          }
        />

        <DoubleEndedSlider
          label="Mood"
          min={0}
          max={1}
          defaultMin={songDetailsFilters.mood.min}
          defaultMax={songDetailsFilters.mood.max}
          formatValue={(v) =>
            v === 0.3
              ? "Low Energy"
              : v === 0.7
                ? "High Energy"
                : `${(v * 100).toFixed(0)}%`
          }
          onChange={(range) => handleSongDetailsFilterChange("mood", range)}
        />
      </div>
    </div>
  );

  const renderGenres = () => (
    <div className="h-full flex flex-col">
      <GenresSection
        navigateBack={navigateBack}
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop for main content */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div
        className={`relative w-full lg:w-lg h-full bg-gray-000 shadow-xl transform transition-transform duration-500 [ease:cubic-bezier(0.16,1,0.3,1)] ${
          animateIn ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Panel Container with full-height layout and left border */}
        <div className="relative w-full h-full flex flex-col border-l border-gray-300">
          {/* Sliding Panels Wrapper (scrollable area) */}
          <div className="flex-1 relative overflow-hidden">
            {/* Main Panel */}
            <div
              className={`absolute inset-0 w-full h-full overflow-auto bg-gray-000 transition-transform duration-300 ease-in-out ${
                activePanel === "main" ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              {renderMainView()}
            </div>

            {/* Song Details Panel */}
            <div
              className={`absolute inset-0 w-full h-full overflow-auto bg-gray-000 transition-transform duration-300 ease-in-out ${
                activePanel === "songDetails"
                  ? "translate-x-0"
                  : "translate-x-full"
              }`}
            >
              {renderSongDetails()}
            </div>

            {/* Genres Panel */}
            <div
              className={`absolute inset-0 w-full h-full overflow-auto bg-gray-000 transition-transform duration-300 ease-in-out ${
                activePanel === "genres" ? "translate-x-0" : "translate-x-full"
              }`}
            >
              {renderGenres()}
            </div>
          </div>

          {/* Footer */}
          <div className="w-full flex flex-row justify-between px-4 py-4">
            <button
              className="py-2 px-1 text-gray-400 hover:text-white transition-colors"
              onClick={clearFilters}
            >
              Clear
            </button>
            <button
              className="px-6 py-2 bg-gray-700 text-gray-000 rounded hover:bg-gray-200 transition-colors"
              onClick={() => closeAndGet()}
            >
              Get Songs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
