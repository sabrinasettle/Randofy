const FilterButton = ({ handleActivation, string, activeFilter }) => {
  return (
    <div
      className={`p-2 flex items-center cursor-pointer hover:underline ${activeFilter === string ? `text-gray-700` : `text-gray-500`}`}
      onClick={handleActivation}
    >
      {string}
    </div>
  );
};

export default function DateFilterTabs({ updateFilter, historyFilter }) {
  function handleActivation(e) {
    let element = e.target;
    updateFilter(element.textContent);
    // from the handler get the id and then check to see if it is the one
  }

  return (
    //md:max-w-max
    <div className="font-body bg-gray-100 flex flex-row w-full rounded-sm justify-evenly items-center">
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
