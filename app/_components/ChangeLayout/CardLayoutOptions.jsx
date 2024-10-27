export default function CardLayoutOptions({ changeView }) {
  return (
    <div>
      <button onClick={changeView}> Long Cards</button>
      <button onClick={changeView}> Grid </button>
      <button onClick={changeView}> List </button>
    </div>
  );
}
