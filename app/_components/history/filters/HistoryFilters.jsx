import { useSongViewContext } from "../../../context/song-view-context";

const FilterButton = ({ handleActivation, string, activeFilter }) => {
  return (
    <div
      className={`p-2 flex items-center text-gray-500 cursor-pointer ${activeFilter === string ? `text-gray-700` : `text - gray - 500`}`}
      onClick={handleActivation}
    >
      {string}
    </div>
  );
};

export default function HistoryFilters({ updateFilter, historyFilter }) {
  // const [activeFilter, setActiveFilter] = useState("All");
  const { songViewContext } = useSongViewContext();
  const isMobile = songViewContext.isMobile;

  function handleActivation(e) {
    let element = e.target;
    // setActiveFilter(element.textContent);
    updateFilter(element.textContent);
    // from the handler get the id and then check to see if it is the one
  }

  return (
    <div className="bg-gray-100 flex flex-row rounded-sm items-center">
      <FilterButton
        handleActivation={handleActivation}
        string={"All"}
        activeFilter={historyFilter}
      />
      <FilterButton
        handleActivation={handleActivation}
        string={"This Week"}
        activeFilter={historyFilter}
      />
      <FilterButton
        handleActivation={handleActivation}
        string={"This Month"}
        activeFilter={historyFilter}
      />
      <FilterButton
        handleActivation={handleActivation}
        string={"Past 6 Months"}
        activeFilter={historyFilter}
      />
    </div>
  );
}
