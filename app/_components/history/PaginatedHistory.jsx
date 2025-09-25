import React, { useMemo } from "react";
import { useHistoryContext } from "../../context/history-context";
import SongCard from "./SongCard";
import { useIsMobile } from "../../_hooks/useIsMobile";

// Currently the structure of the History follows this pattern:
// [{date : [song{}, song{}, song{}]}, {date : [song{}, song{}, song{}]}, ]

export default function PaginatedHistory() {
  const { historyContext } = useHistoryContext();
  const {
    visibleCount,
    loadMoreSongs,
    layoutType,
    genreFilters,
    songFeaturesFilters,
    dateRangeFilter,
  } = historyContext;

  const history = historyContext.songHistory;
  const isMobile = useIsMobile();

  const paginatedSongs = useMemo(() => {
    let filteredSongs = history.allSongsChronological;
    if (dateRangeFilter !== "All") {
      filteredSongs = historyContext.filterByDate();
    }

    if (genreFilters.size !== 0) {
      const genreArray = [...genreFilters];
      filteredSongs = filteredSongs.filter((song) =>
        song.genres.some((genre) => genreArray.includes(genre)),
      );
    }

    // add filters for features - songFeaturesFilters
    // feature filters
    //
    const featureKeyMap = {
      acoustic: "acousticness",
      instrumental: "instrumentalness",
      popularity: "popularity", // stays the same
      energy: "energy",
      vocals: "speechiness",
      danceability: "danceability",
      mood: "valence",
    };

    if (songFeaturesFilters && Object.keys(songFeaturesFilters).length > 0) {
      const activeFilters = Object.entries(songFeaturesFilters).filter(
        ([, { min, max }]) => min !== 0.0 || max !== 1.0,
      );

      if (activeFilters.length > 0) {
        filteredSongs = filteredSongs.filter((song) => {
          for (const [feature, { min, max }] of activeFilters) {
            const spotifyKey = featureKeyMap[feature] || feature;

            const raw =
              feature === "popularity"
                ? song[feature] / 100
                : song.audioFeatures?.[spotifyKey];

            if (raw == null) continue; // skip missing features

            const value = typeof raw === "number" ? raw : Number(raw);
            if (value < min || value > max) return false; // fail fast
          }
          return true;
        });
      }
    }

    if (filteredSongs.length !== 0 && filteredSongs)
      filteredSongs = filteredSongs.slice(0, visibleCount);

    return filteredSongs;
  }, [
    history,
    visibleCount,
    genreFilters,
    dateRangeFilter,
    songFeaturesFilters,
  ]);

  const progressString = `${Math.min(
    visibleCount,
    paginatedSongs.length,
  )} / ${paginatedSongs.length}`;

  const groupedByDate = useMemo(() => {
    return paginatedSongs.reduce((acc, song) => {
      if (!acc[song.date]) acc[song.date] = [];
      acc[song.date].push(song);
      return acc;
    }, {});
  }, [paginatedSongs]);

  const list =
    layoutType === "list-grid"
      ? "flex flex-col"
      : "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";

  function isToday(date) {
    const today = new Date();
    let dateString = today.toLocaleDateString();
    return date === dateString;
  }

  const formatDate = (input) => {
    const [month, day, year] = input.split("/").map(Number);
    const date = new Date(year, month - 1, day);

    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="flex flex-col justify-center mt-4 px-4">
      <div
        className={`space-y-6 ${paginatedSongs.length >= visibleCount ? "pb-0" : "pb-8"}`}
      >
        {Object.entries(groupedByDate).map(([date, songs]) => (
          <div className="text-gray-700" key={`${date}`}>
            <h2 className="font-body text-heading-2 lg:text-heading-1 font-semibold mb-8 mt-20">
              {isToday(date) ? "Today" : `${formatDate(date)}`}
            </h2>
            <ul className={list}>
              {songs.map((song, index) => (
                <SongCard
                  song={song}
                  index={index}
                  scrollTo
                  key={`song ` + `${song.track_name} + ${index}`}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* {paginatedSongs.length >= visibleCount && (*/}
      <div className="flex justify-between w-full pt-8 pb-8">
        <p className="text-body-md font-mono text-gray-700">{progressString}</p>

        {Math.min(visibleCount, paginatedSongs.length) !==
          paginatedSongs.length && (
          <button
            className="text-body-md font-mono text-gray-600 hover:text-gray-700 mr-33"
            onClick={loadMoreSongs}
          >
            Load More
          </button>
        )}
      </div>
      {/* )}*/}
    </div>
  );
}
