import { useGridContext } from "../../context/card-layout-context";

export default function CardLayoutOptions() {
  const { layoutContext } = useGridContext();

  return (
    <div>
      <button onClick={layoutContext.changeLayout} aria-label="oblong-grid">
        Long Cards
      </button>
      <button onClick={layoutContext.changeLayout} aria-label="square-grid">
        Grid
      </button>
      <button onClick={layoutContext.changeLayout} aria-label="list">
        List
      </button>
    </div>
  );
}
