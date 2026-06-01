import GetSongsButton from "./GetSongsButton";
import { useSpotifyContext } from "../../context/spotify-context";
import { useMusicContext } from "../../context/music-context";

const FilterButton = ({ handleOpen, isSmall }) => {
  const { musicContext } = useMusicContext();

  const classString = isSmall
    ? `bg-gray-100 px-3 py-2 md:w-auto`
    : `bg-gray-100 px-4 py-3 md:w-auto`;

  //values changed
  const string =
    musicContext.filtersTotal > 0
      ? `${isSmall ? "Filter Songs" : "Tune Filters"} [${
          musicContext.filtersTotal
        }]`
      : isSmall
        ? "Filter Songs"
        : "Tune Filters";

  return (
    <button
      className={`flex-1 font-body rounded-sm text-gray-700 border border-transparent hover:border-gray-300 transition-all duration-700 ease-in-out min-w-fit ${
        isSmall ? "text-heading-6" : "w-full text-heading-5"
      } ${classString}`}
      onClick={handleOpen}
    >
      {string}
    </button>
  );
};

export default function ButtonsContainer({
  hasContent,
  filtersOpen,
  setFilterOpen,
}) {
  const containerClass = hasContent
    ? "flex-row pt-2 px-4 w-full md:w-auto"
    : "flex-col max-w-[80%] w-full md:w-auto md:flex-row";

  return (
    <div
      className={`flex gap-4 items-center transition-all duration-400 ease-in-out z-40 order-2 md:order-2 mx-auto ${containerClass}`}
      style={{
        transformOrigin: "center",
      }}
    >
      <GetSongsButton isSmall={hasContent} />
      <FilterButton
        handleOpen={() => setFilterOpen(!filtersOpen)}
        isSmall={hasContent}
      />
    </div>
  );
}
