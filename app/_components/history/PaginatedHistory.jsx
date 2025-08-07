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
  const progressString = `${Math.min(
    visibleCount,
    history.totalSongs,
  )} / ${history.totalSongs}`;

  const paginatedSongs = useMemo(() => {
    console.log("total", history.totalSongs);

    let filteredSongs = history.allSongsChronological;
    if (dateRangeFilter !== "All") {
      filteredSongs = historyContext.filterByDate();
    }

    if (genreFilters.size !== 0) {
      console.log(genreFilters, filteredSongs.length);
      const genreArray = [...genreFilters];
      filteredSongs = filteredSongs.filter((song) =>
        song.genres.some((genre) => genreArray.includes(genre)),
      );
    }

    if (filteredSongs.length !== 0 && filteredSongs)
      filteredSongs = filteredSongs.slice(0, visibleCount);

    return filteredSongs;
  }, [history, visibleCount, genreFilters, dateRangeFilter]);

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

// function filterObjectByDateRange(obj, startDate, endDate) {
//   const filteredObj = {};
//   // console.log(historyFilter, startDate, endDate);

//   Object.keys(obj)
//     .filter((tDate) => {
//       const date = new Date(tDate);
//       // console.log(date);
//       if (date >= startDate && date <= endDate) {
//         return true;
//       }
//       return false;
//     })
//     .map((key) => {
//       filteredObj[key] = obj[key];
//     });

//   return filteredObj;
// }

// function filterByDate() {
//   const now = new Date();
//   const today = new Date();
//   const startOfDay = new Date(now.setHours(0, 0, 0, 0));
//   const endOfDay = new Date(now.setHours(23, 59, 59, 59));

//   switch (dateRangeFilter) {
//     case dateRangeFilter === "Today":
//       return filterObjectByDateRange(songHistory, startOfDay, endOfDay);
//     case dateRangeFilter === "This Week":
//       let thisWeek = getThisWeek(today);
//       return filterObjectByDateRange(
//         songHistory,
//         thisWeek.start,
//         thisWeek.end,
//       );
//     case dateRangeFilter === "This Month":
//       let thisMonth = getThisMonth(today);
//       return filterObjectByDateRange(
//         songHistory,
//         thisMonth.start,
//         thisMonth.end,
//       );
//     case dateRangeFilter === "Past 6 Months":
//       let past6Months = getPast6Months(today);
//       return filterObjectByDateRange(
//         history,
//         past6Months.start,
//         past6Months.end,
//       );
//     default:
//       return songHistory;
//   }

//   if (dateRangeFilter === "Today") {
//     return filterObjectByDateRange(songHistory, startOfDay, endOfDay);
//   } else if (dateRangeFilter === "This Week") {
//     let thisWeek = getThisWeek(today);
//     return filterObjectByDateRange(songHistory, thisWeek.start, thisWeek.end);
//   } else if (dateRangeFilter === "This Month") {
//     let thisMonth = getThisMonth(today);
//     return filterObjectByDateRange(
//       songHistory,
//       thisMonth.start,
//       thisMonth.end,
//     );
//   } else if (dateRangeFilter === "Past 6 Months") {
//     let past6Months = getPast6Months(today);
//     return filterObjectByDateRange(
//       history,
//       past6Months.start,
//       past6Months.end,
//     );
//   }
//   return history;
// }
