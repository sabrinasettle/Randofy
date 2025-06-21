import GetSongsButton from "./GetSongsButton";

const FilterButton = ({ handleOpen, isSmall }) => {
  const classString = isSmall
    ? `bg-gray-100 px-3 py-2 md:w-auto`
    : `bg-gray-100 px-4 py-3 md:w-auto`;

  return (
    <button
      className={`rounded-sm text-gray-700 border border-transparent hover:border-gray-200 transition-all duration-700 ease-in-out w-full md:w-auto ${
        isSmall ? "text-heading-6" : "text-heading-5"
      } ${classString}`}
      onClick={handleOpen}
    >
      Filter Songs
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
  return (
    <div
      className={`flex gap-4 items-center transition-all duration-700 ease-in-out z-50 order-2 md:order-1 w-full md:w-auto
        ${hasContent ? `flex-row pt-5` : `flex-col`} md:flex-row
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
