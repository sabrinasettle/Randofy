import React, { useEffect, useMemo } from "react";
import { useHistoryContext } from "../../context/history-context";
import SongCard from "./SongCard";

export default function PaginatedHistory() {
  const { historyContext } = useHistoryContext();
  const {
    visibleCount,
    loadMoreSongs,
    layoutType,
    genreFilters,
    songFeaturesFilters,
    dateRangeFilter,
    sortOption,
    setDisplaySongs, // ✅ Option A
    displaySongs, // ✅ read current value to avoid infinite loop
  } = historyContext;

  const history = historyContext.songHistory;
  const isAlphaSort = sortOption === "alpha-asc" || sortOption === "alpha-desc";

  /* ---------- helpers ---------- */

  const getAlphaGroupKey = (title) => {
    if (!title || typeof title !== "string" || title.trim() === "") return "★";

    const t = title.trim();

    try {
      const [first] = Array.from(t);
      if (!first) return "★";

      if (/\p{N}/u.test(first)) return "#";

      if (/\p{L}/u.test(first)) {
        const normalized = first
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toUpperCase();

        if (normalized >= "A" && normalized <= "Z") return normalized;
        return "★";
      }

      return "★";
    } catch (error) {
      console.warn("Error parsing title:", title, error);
      return "★";
    }
  };

  const alphaGroupOrder = (a, b, direction) => {
    const orderAsc = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "★",
      "#",
    ];
    const orderDesc = [
      "#",
      "★",
      "Z",
      "Y",
      "X",
      "W",
      "V",
      "U",
      "T",
      "S",
      "R",
      "Q",
      "P",
      "O",
      "N",
      "M",
      "L",
      "K",
      "J",
      "I",
      "H",
      "G",
      "F",
      "E",
      "D",
      "C",
      "B",
      "A",
    ];
    const order = direction === "asc" ? orderAsc : orderDesc;
    return order.indexOf(a) - order.indexOf(b);
  };

  const getDateGroupKey = (song) =>
    (song.date ?? song.played_at ?? song.added_at ?? "unknown").split("T")[0];

  const isToday = (iso) => iso === new Date().toISOString().split("T")[0];

  const formatDate = (iso) =>
    new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));

  const songKey = (song) => `${song.track_id}-${song.generated_at}`;

  /* ---------- main logic ---------- */

  const { groupedData, totalFiltered, displayList, displaySig } =
    useMemo(() => {
      const all = history?.allSongsChronological ?? [];
      let working = all;

      /* 1) filters */
      if (dateRangeFilter !== "All") {
        // assumes HistoryContext.filterByDate(dateRange, songs)
        working = historyContext.filterByDate(dateRangeFilter, working) ?? [];
      }

      if (genreFilters?.size > 0) {
        const g = [...genreFilters];
        working = working.filter(
          (s) => Array.isArray(s.genres) && s.genres.some((x) => g.includes(x)),
        );
      }

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
        const active = Object.entries(songFeaturesFilters).filter(
          ([, v]) => v.min !== 0 || v.max !== 1,
        );

        if (active.length) {
          working = working.filter((song) =>
            active.every(([f, { min, max }]) => {
              const k = featureKeyMap[f] || f;
              const raw =
                f === "popularity" ? song[f] / 100 : song.audioFeatures?.[k];
              if (raw == null) return true;
              const v = Number(raw);
              return v >= min && v <= max;
            }),
          );
        }
      }

      /* 2) base sort */
      const sorted = [...working].sort((a, b) => {
        if (isAlphaSort) {
          const aTitle = a.track_name || "";
          const bTitle = b.track_name || "";
          return sortOption === "alpha-asc"
            ? aTitle.localeCompare(bTitle)
            : bTitle.localeCompare(aTitle);
        }

        return sortOption === "time-recent"
          ? new Date(b.generated_at || 0) - new Date(a.generated_at || 0)
          : new Date(a.generated_at || 0) - new Date(b.generated_at || 0);
      });

      const totalFiltered = sorted.length;

      /* 3) grouping (FULL, before pagination) */
      const fullGroups = {};
      for (const song of sorted) {
        const key = isAlphaSort
          ? getAlphaGroupKey(song.track_name)
          : getDateGroupKey(song);

        if (!fullGroups[key]) fullGroups[key] = [];
        fullGroups[key].push(song);
      }

      /* 4) order group keys */
      const orderedKeys = Object.keys(fullGroups).sort((a, b) =>
        isAlphaSort
          ? alphaGroupOrder(a, b, sortOption === "alpha-desc" ? "desc" : "asc")
          : 0,
      );

      /* ✅ 5) traversal list in EXACT display order */
      const displayList = orderedKeys.flatMap((k) => fullGroups[k]);

      /* ✅ 5b) stable-ish signature so we can avoid infinite updates */
      const displaySig =
        displayList.length === 0
          ? "0"
          : `${displayList.length}:${songKey(displayList[0])}:${songKey(
              displayList[displayList.length - 1],
            )}`;

      /* 6) build index map for attaching view-index to each song */
      const indexByKey = new Map();
      for (let i = 0; i < displayList.length; i++) {
        indexByKey.set(songKey(displayList[i]), i);
      }

      /* 7) paginate while preserving groups */
      let count = 0;
      const visibleGroups = {};

      for (const key of orderedKeys) {
        for (const song of fullGroups[key]) {
          if (count >= visibleCount) break;

          const withIndex = {
            ...song,
            __displayIndex: indexByKey.get(songKey(song)),
          };

          if (!visibleGroups[key]) visibleGroups[key] = [];
          visibleGroups[key].push(withIndex);
          count++;
        }
        if (count >= visibleCount) break;
      }

      return {
        groupedData: visibleGroups,
        totalFiltered,
        displayList,
        displaySig,
      };
    }, [
      history,
      sortOption,
      dateRangeFilter,
      genreFilters,
      songFeaturesFilters,
      visibleCount,
      historyContext,
      isAlphaSort,
    ]);

  /* ✅ avoid infinite loop: only set when signature differs */
  useEffect(() => {
    if (typeof setDisplaySongs !== "function") return;

    const currentSig =
      !displaySongs || displaySongs.length === 0
        ? "0"
        : `${displaySongs.length}:${songKey(displaySongs[0])}:${songKey(
            displaySongs[displaySongs.length - 1],
          )}`;

    if (currentSig !== displaySig) {
      setDisplaySongs(displayList ?? []);
    }
  }, [displaySig, displayList, displaySongs, setDisplaySongs]);

  /* ---------- layout ---------- */

  const list =
    layoutType === "list-grid"
      ? "flex flex-col"
      : "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";

  const progressString = `${Math.min(visibleCount, totalFiltered)} / ${totalFiltered}`;

  /* ---------- render ---------- */

  return (
    <div className="flex flex-col justify-center mt-4 px-1">
      <div className="space-y-6 pb-8">
        {Object.entries(groupedData).map(([key, songs]) => (
          <div key={key} className="text-gray-700">
            <h2 className="font-body text-heading-2 lg:text-heading-1 font-semibold mb-8 mt-20">
              {isAlphaSort ? key : isToday(key) ? "Today" : formatDate(key)}
            </h2>

            <ul className={list}>
              {songs.map((song) => (
                <SongCard
                  key={songKey(song)}
                  song={song}
                  index={song.__displayIndex}
                  scrollTo
                />
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex justify-between w-full pt-8 pb-8">
        <p className="text-body-md font-mono text-gray-700">{progressString}</p>

        {visibleCount < totalFiltered && (
          <button
            className="text-body-md font-mono text-gray-600 hover:text-gray-700 mr-33"
            onClick={loadMoreSongs}
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
}
