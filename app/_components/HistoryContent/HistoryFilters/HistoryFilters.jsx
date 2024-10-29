import styles from "../History.module.scss";

const FilterButton = ({ handleActivation, string, activeFilter }) => {
  return (
    <div
      className={
        activeFilter === string
          ? `${styles["btn-filter"]} ${styles["btn-filter__active"]} btn-action `
          : `${styles["btn-filter"]} btn-action `
      }
      onClick={handleActivation}
    >
      {string}
    </div>
  );
};

export default function HistoryFilters({ updateFilter, historyFilter }) {
  // const [activeFilter, setActiveFilter] = useState("All");

  function handleActivation(e) {
    let element = e.target;
    // setActiveFilter(element.textContent);
    updateFilter(element.textContent);
    // from the handler get the id and then check to see if it is the one
  }

  return (
    <div id={styles["filter-btns-container"]}>
      <FilterButton
        handleActivation={handleActivation}
        string={"All"}
        activeFilter={historyFilter}
      />
      <FilterButton
        handleActivation={handleActivation}
        string={"Today"}
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
