"use client";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";

export default function GenresSection({
  navigateBack,
  selectedGenres,
  setSelectedGenres,
}) {
  const genres = [
    "acoustic",
    "afrobeat",
    "alt-rock",
    "alternative",
    "ambient",
    "anime",
    "black-metal",
    "bluegrass",
    "blues",
    "bossanova",
    "brazil",
    "breakbeat",
    "british",
    "cantopop",
    "chicago-house",
    "children",
    "chill",
    "classical",
    "club",
    "comedy",
    "country",
    "dance",
    "dancehall",
    "death-metal",
    "deep-house",
    "detroit-techno",
    "disco",
    "disney",
    "drum-and-bass",
    "dub",
    "dubstep",
    "edm",
    "electro",
    "electronic",
    "emo",
    "folk",
    "forro",
    "french",
    "funk",
    "garage",
    "german",
    "gospel",
    "goth",
    "grindcore",
    "groove",
    "grunge",
    "guitar",
    "happy",
    "hard-rock",
    "hardcore",
    "hardstyle",
    "heavy-metal",
    "hip-hop",
    "holidays",
    "honky-tonk",
    "house",
    "idm",
    "indian",
    "indie",
    "indie-pop",
    "industrial",
    "iranian",
    "j-dance",
    "j-idol",
    "j-pop",
    "j-rock",
    "jazz",
    "k-pop",
    "kids",
    "latin",
    "latino",
    "malay",
    "mandopop",
    "metal",
    "metal-misc",
    "metalcore",
    "minimal-techno",
    "movies",
    "mpb",
    "new-age",
    "new-release",
    "opera",
    "pagode",
    "party",
    "philippines-opm",
    "piano",
    "pop",
    "pop-film",
    "post-dubstep",
    "power-pop",
    "progressive-house",
    "psych-rock",
    "punk",
    "punk-rock",
    "r-n-b",
    "rainy-day",
    "reggae",
    "reggaeton",
    "road-trip",
    "rock",
    "rock-n-roll",
    "rockabilly",
    "romance",
    "sad",
    "salsa",
    "samba",
    "sertanejo",
    "show-tunes",
    "singer-songwriter",
    "ska",
    "sleep",
    "songwriter",
    "soul",
    "soundtracks",
    "spanish",
    "study",
    "summer",
    "swedish",
    "synth-pop",
    "tango",
    "techno",
    "trance",
    "trip-hop",
    "turkish",
    "work-out",
    "world-music",
  ];

  // Group genres by first letter - memoized since genres array is static
  const { groupedGenres, sortedLetters } = useMemo(() => {
    const grouped = genres.reduce((acc, genre) => {
      const firstLetter = genre[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(genre);
      return acc;
    }, {});

    return {
      groupedGenres: grouped,
      sortedLetters: Object.keys(grouped).sort(),
    };
  }, []);

  const toggleGenre = (genre) => {
    const newSelected = new Set(selectedGenres);
    if (newSelected.has(genre)) {
      newSelected.delete(genre);
    } else {
      newSelected.add(genre);
    }
    setSelectedGenres(newSelected);
  };

  // Memoize the selected count calculations to avoid recalculating on each render
  const sectionSelectedCounts = useMemo(() => {
    const counts = {};
    sortedLetters.forEach((letter) => {
      counts[letter] = groupedGenres[letter].filter((genre) =>
        selectedGenres.has(genre),
      ).length;
    });
    return counts;
  }, [selectedGenres, groupedGenres, sortedLetters]);

  // Memoize the sorted selected genres array
  const sortedSelectedGenres = useMemo(() => {
    return Array.from(selectedGenres).sort();
  }, [selectedGenres]);

  const formatGenreName = useMemo(() => {
    const cache = {};
    return (genre) => {
      if (!cache[genre]) {
        cache[genre] = genre
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }
      return cache[genre];
    };
  }, []);

  return (
    <>
      <div className="p-4 flex flex-row justify-between">
        <button
          onClick={navigateBack}
          className="flex items-center gap-4 text-gray-400 hover:text-white"
        >
          <ArrowLeft size={20} />
          <h1 className="text-white text-lg font-medium">Genres</h1>
        </button>
        {selectedGenres.size === 0 ? (
          <span className="text-lg font-normal text-gray-600">
            [{selectedGenres.size}]
          </span>
        ) : (
          <span className="font-semibold text-gray-700">
            [{selectedGenres.size}]
          </span>
        )}
      </div>
      {/* Content */}
      <div className="flex-1 px-4">
        <p className="text-body-sm text-gray-500 text-balance">
          Disclaimer: *While Spotify identifies and works with thousands of
          subgenres these are the available genres to search against
        </p>
        {/* Alpha lists of the genres */}
        <div className="space-y-6">
          {sortedLetters.map((letter) => (
            <div key={letter} className="pt-4">
              <div className="flex items-center justify-between pb-1 mb-3 border-b border-gray-500">
                <h2 className="text-body-sm font-normal text-gray-800 flex items-center pl-2">
                  {letter.toUpperCase()}
                </h2>
                <div className="text-gray-700 text-sm font-medium">
                  [{sectionSelectedCounts[letter]}]
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {groupedGenres[letter].map((genre) => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`
                              px-3 py-2 rounded-sm text-sm transition-all duration-200 text-left
                              ${
                                selectedGenres.has(genre)
                                  ? "font-semibold bg-gray-100 text-white shadow-md transform scale-101"
                                  : "font-medium bg-gray-000 text-gray-600 hover:bg-gray-200 hover:text-gray-700 hover:shadow-sm"
                              }
                            `}
                  >
                    {formatGenreName(genre)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
