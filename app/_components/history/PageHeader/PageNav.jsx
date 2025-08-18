import CardLayoutOptions from "./CardLayoutOptions";

export default function PageHeader() {
  return (
    <div className="flex justify-center mt-4">
      <CardLayoutOptions />
      <button
        className="px-4 py-2 bg-gray-200 rounded-l-md"
        onClick={handlePrev}
        disabled={page === 1}
      >
        Previous
      </button>
    </div>
  );
}
