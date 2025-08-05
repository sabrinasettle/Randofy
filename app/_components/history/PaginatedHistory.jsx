import React, { useMemo } from "react";
import { useHistoryContext } from "../../context/history-context";
import SongCard from "./SongCard";
import { useIsMobile } from "../../_hooks/useIsMobile";

// Currently the structure of the History follows this pattern:
// [{date : [song{}, song{}, song{}]}, {date : [song{}, song{}, song{}]}, ]

export default function PaginatedHistory() {
  const { historyContext } = useHistoryContext();
  const { visibleCount, songsPerLoad, loadMoreSongs, layoutType } =
    historyContext;

  const history = historyContext.songHistory;
  const isMobile = useIsMobile();
  const progressString = `${Math.min(
    visibleCount,
    history.totalSongs,
  )} / ${history.totalSongs}`;

  const paginatedSongs = useMemo(() => {
    return history.allSongsChronological.slice(0, visibleCount);
  }, [history, visibleCount]);

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
    <div className="flex flex-col justify-center mt-4">
      <div className="space-y-6">
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
      <div className="flex justify-between w-full pt-6 pb-20">
        <p className="font-mono text-gray-700">{progressString}</p>
        <button className="font-mono text-gray-700" onClick={loadMoreSongs}>
          Load More
        </button>
      </div>
    </div>
  );
}
