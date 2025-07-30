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
      ? `Filter Songs [${musicContext.filtersTotal}]`
      : "Filter Songs";

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
  {
    /* Buttons Container - responsive behavior */
  }

  const containerClass = hasContent
    ? "flex-col md:flex-row scale-95 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-4"
    : "flex-col md:flex-row scale-100 bottom-3 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:translate-y-20";

  return (
    <div
      className={`flex gap-4 items-center transition-all duration-400 ease-in-out z-40 order-2 md:order-2 mx-auto w-full md:w-auto
        ${hasContent ? `flex-row pt-2 px-4` : `flex-col max-w-[80%]`} md:flex-row
        `}
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

// ${
// // Mobile behavior - keep flex-col on mobile, flex-row on desktop
// hasContent
//   ? "flex-col md:flex-row scale-95 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-4"
//   : "flex-col md:flex-row scale-100 bottom-3 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:translate-y-20"
// }
