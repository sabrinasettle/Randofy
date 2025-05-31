import { useState } from "react";
import DoubleEndedSlider from "../ui/DoubleEndedSlider";

const renderSongDetails = () => {
  return (
    <div>
      <div className="flex flex-row justify-between pb-10">
        <button className="text-gray-700">Back</button>
        <h1>Genres</h1>
      </div>
    </div>
  );
};

const renderSongDetaile = () => {
  return (
    <div>
      <div className="flex flex-row justify-between pb-10">
        <button className="text-gray-700">Back</button>
        <h1>Song Details</h1>
      </div>
      <div>
        <DoubleEndedSlider
          min={0.0}
          max={1.0}
          step={0.01}
          defaultMin={0.2}
          defaultMax={0.8}
          label="Opacity"
          formatValue={(v) => `${(v * 100).toFixed(0)}%`}
          onChange={(range) => console.log("Selected:", range)}
        />
        <DoubleEndedSlider
          min={0.0}
          max={1.0}
          step={0.01}
          defaultMin={0.2}
          defaultMax={0.8}
          label="Opacity"
          formatValue={(v) => `${(v * 100).toFixed(0)}%`}
          onChange={(range) => console.log("Selected:", range)}
        />
        <DoubleEndedSlider
          min={0.0}
          max={1.0}
          step={0.01}
          defaultMin={0.2}
          defaultMax={0.8}
          label="Opacity"
          formatValue={(v) => `${(v * 100).toFixed(0)}%`}
          onChange={(range) => console.log("Selected:", range)}
        />
        <DoubleEndedSlider
          min={0.0}
          max={1.0}
          step={0.01}
          defaultMin={0.2}
          defaultMax={0.8}
          label="Opacity"
          formatValue={(v) => `${(v * 100).toFixed(0)}%`}
          onChange={(range) => console.log("Selected:", range)}
        />
      </div>
    </div>
  );
};

const renderMainView = () => {
  const [sliderValue, setSliderValue] = useState(5);

  const handleSliderChange = (e) => {
    setSliderValue(parseInt(e.target.value));
  };
  return (
    <div>
      <div className="flex flex-row justify-between pb-10">
        <h1>Filter Songs</h1>
        <button className="text-gray-700">Close</button>
      </div>
      <div>
        <div className="mb-6">
          <label
            htmlFor="custom-range"
            className="flex flex-row items-center gap-2 pb-3"
          >
            <div className="py-1 px-2 border border-gray-300 rounded-sm text-gray-700 text-heading-4 min-w-[3rem] text-center">
              {sliderValue}
            </div>
            <p className="text-gray-700 text-heading-4">Totally random songs</p>
          </label>
          <input
            id="custom-range"
            type="range"
            min="5"
            max="100"
            value={sliderValue}
            onChange={handleSliderChange}
            className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
          />
        </div>

        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #e5e5e5;
            cursor: pointer;
            border: none;
            transition: background-color 0.3s ease;
          }

          .slider::-moz-range-thumb {
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #e5e5e5;
            cursor: pointer;
            border: none;
            transition: background-color 0.3s ease;
          }

          .slider::-webkit-slider-track {
            height: 4px;
            border-radius: 2px;
          }

          .slider::-moz-range-track {
            height: 4px;
            border-radius: 2px;
          }

          /* Progressive fill effect */
          .slider {
            background: linear-gradient(
              to right,
              #b2b2b2 0%,
              #b2b2b2 ${((sliderValue - 5) / 95) * 100}%,
              #4b4b4b ${((sliderValue - 5) / 95) * 100}%,
              #4b4b4b 100%
            );
            border-radius: 2px;
          }
        `}</style>
      </div>
    </div>
  );
};

export default function FilterDrawer({ handleOpen }) {
  // const [sliderValue, setSliderValue] = useState(5);

  // const handleSliderChange = (e) => {
  //   setSliderValue(parseInt(e.target.value));
  // };

  return (
    <div className="h-full absolute top-0 right-0 bg-gray-100 z-50 w-md border-gray-200 border-l">
      <div className="flex flex-col p-6">
        <div className="flex flex-row justify-between pb-10">
          <h1>Filter Songs</h1>
          <button className="text-gray-700">Close</button>
        </div>

        <div className="w-full h-12 border-gray-200 border-t flex flex-row items-center justify-between">
          <p className="text-gray-700">Song Details</p>
        </div>
        <div className="w-full h-12 border-gray-200 border-t flex flex-row items-center justify-between">
          <p className="text-gray-700">Genres</p>
        </div>
      </div>
    </div>
  );
}
