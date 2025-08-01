import React, { useMemo } from "react";
import { useHistoryContext } from "../../context/history-context";
import SongCard from "./SongCard";

// Currently the structure of the History follows this pattern:
// [{date : [song{}, song{}, song{}]}, {date : [song{}, song{}, song{}]}, ]

export default function PaginatedHistory() {
  const { historyContext } = useHistoryContext();
  const {
    songsPerPage,
    currentPage,
    totalPages,
    onPageChange,
    handlePrevPage,
    handleFirstPage,
    handleLastPage,
    handleNextPage,
    layoutType,
  } = historyContext;

  const history = historyContext.songHistory;

  const paginatedSongs = useMemo(() => {
    const start = currentPage * songsPerPage;
    return history.allSongsChronological.slice(start, start + songsPerPage);
  }, [history, currentPage, songsPerPage]);

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
            <h2 className="text-lg font-semibold mb-2">
              {" "}
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
      <div>
        <button
          className="px-6 py-2 bg-gray-600 border border-transparent hover:border-gray-600 hover:bg-gray-700 text-gray-000 rounded transition-colors duration-400 ease-in-out font-body"
          onClick={handlePrevPage}
        >
          Previous
        </button>
        <button
          className="px-6 py-2 bg-gray-600 border border-transparent hover:border-gray-600 hover:bg-gray-700 text-gray-000 rounded transition-colors duration-400 ease-in-out font-body"
          onClick={handleNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}
