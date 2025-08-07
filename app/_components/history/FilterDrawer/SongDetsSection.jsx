"use client";
import {} from "react";
import DoubleEndedSlider from "../../ui/DoubleEndedSlider";
import { ArrowLeft } from "lucide-react";
import { useHistoryContext } from "../../../context/history-context";

export default function SongDetailsSection({
  navigateBack,
  songDetailsFilters,
  onFilterChange,
  changed,
}) {
  const { historyContext } = useHistoryContext();
  const valueStrings = historyContext?.songFeatureStrings;

  function handleItem(key, index) {
    const values = new Map();
    values.set(0, 0.25);
    values.set(1, 0.5);
    values.set(2, 0.75);
    values.set(3, 1);
    console.log(key, index, values.get(index));
  }

  return (
    <>
      <div className="p-4 flex flex-row justify-between">
        <button
          onClick={navigateBack}
          className="flex items-center gap-4 text-gray-400 hover:text-white"
        >
          <ArrowLeft size={20} />
          <h1 className="text-white text-body-lg font-body">Song Details</h1>
        </button>
        {changed === 0 ? (
          <span className="text-lg font-normal text-gray-600">[{changed}]</span>
        ) : (
          <span className="text-lg font-semibold text-gray-700">
            [{changed}]
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* <div className="flex flex-col gap-6">
          {Object.keys(songDetailsFilters).map((key) => (
            <div key={key.charAt(0).toUpperCase() + key.slice(1)}>
              <p
                aria-label={key.charAt(0).toUpperCase() + key.slice(1)}
                className="text-gray-700"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </p>
              <div className="text-gray-700">{songDetailsFilters[key].max}</div>
            </div>
          ))}
        </div>*/}
        <div className="flex flex-col gap-6 space-y-6">
          {Object.keys(valueStrings).map((key) => (
            <div key={key.charAt(0).toUpperCase() + key.slice(1)}>
              <div className="flex items-center justify-between pb-1 mb-3 border-b border-gray-500">
                <h2
                  className="text-body-sm font-body text-gray-600 flex items-center pl-2"
                  aria-label={key.charAt(0).toUpperCase() + key.slice(1)}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </h2>
              </div>
              <div className="flex flex-row gap-2">
                {valueStrings[key].map((string, index) => (
                  <button
                    key={string}
                    className={`px-3 py-2 rounded-sm text-sm transition-all duration-200 text-left font-body font-medium bg-gray-000 text-gray-600 hover:bg-gray-200 hover:text-gray-700 hover:shadow-sm`}
                    onClick={() => handleItem(key, index)}
                  >
                    {string}
                  </button>
                ))}
              </div>
              {/* <div className="text-gray-700">{valueStrings[key]}</div>*/}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
