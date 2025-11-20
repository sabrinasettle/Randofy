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

  // Sorting, Filtering and grouping
  const { groupedData, totalFiltered, totalAll } = useMemo(() => {
    const all = history?.allSongsChronological ?? [];
    let working = all;

    // 1) date filter
    if (dateRangeFilter !== "All") {
      working = historyContext.filterByDate() ?? [];
    }

    // 2) genre filter
    if (genreFilters?.size > 0) {
      const genreArray = [...genreFilters];
      working = working.filter(
        (song) =>
          Array.isArray(song.genres) &&
          song.genres.some((g) => genreArray.includes(g)),
      );
    }

    // 3) feature filters (your existing logic)
    const featureKeyMap = {
      acoustic: "acousticness",
      instrumental: "instrumentalness",
      popularity: "popularity",
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
        working = working.filter((song) => {
          for (const [feature, { min, max }] of activeFilters) {
            const spotifyKey = featureKeyMap[feature] || feature;
            const raw =
              feature === "popularity"
                ? song[feature] / 100
                : song.audioFeatures?.[spotifyKey];

            if (raw == null) continue;
            const value = typeof raw === "number" ? raw : Number(raw);
            if (value < min || value > max) return false;
          }
          return true;
        });
      }
    }

    // 4) sort (safe string handling to avoid localeCompare crashes)
    const safeString = (s) => (typeof s === "string" ? s : "");
    const timeKey = (s) => s?.generated_at;

    const sorted = [...working].sort((a, b) => {
      switch (historyContext.sortOption) {
        case "alpha-asc":
          return safeString(a.track_name).localeCompare(
            safeString(b.track_name),
          );
        case "alpha-desc":
          return safeString(b.track_name).localeCompare(
            safeString(a.track_name),
          );
        case "time-recent":
          return new Date(timeKey(b)) - new Date(timeKey(a));
        case "time-early":
          return new Date(timeKey(a)) - new Date(timeKey(b));
        default:
          return 0;
      }
    });

    // total after filters (before pagination)
    const totalFiltered = sorted.length;

    // 5) paginate AFTER sorting
    const paginated = sorted.slice(0, visibleCount);

    // 6) group only the paginated items for rendering
    const grouped = paginated.reduce((acc, song) => {
      // group by date (YYYY-MM-DD). fallback if date missing.
      const d = (
        song.date ??
        song.played_at ??
        song.added_at ??
        "unknown"
      ).split("T")[0];
      if (!acc[d]) acc[d] = [];
      acc[d].push(song);
      return acc;
    }, {});

    return { groupedData: grouped, totalFiltered, totalAll: all.length };
  }, [
    history,
    historyContext.sortOption,
    dateRangeFilter,
    genreFilters,
    songFeaturesFilters,
    visibleCount,
  ]);

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

  const progressString = `${Math.min(visibleCount, totalFiltered)} / ${totalFiltered}`;

  return (
    <div className="flex flex-col justify-center mt-4 px-1">
      <div
        className={`space-y-6 ${groupedData.length >= visibleCount ? "pb-0" : "pb-8"}`}
      >
        {Object.entries(groupedData).map(([date, songs]) => (
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

        {Math.min(visibleCount, groupedData.length) !== groupedData.length && (
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
