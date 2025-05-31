export default function Slider({ handleSliderChange }) {
  return (
    <div>
      <div className="mb-6">
        <label
          htmlFor="custom-range"
          className="flex flex-row items-center gap-2 pb-3"
        >
          {/* <div className="py-1 px-2 border border-gray-300 rounded-sm text-gray-700 text-heading-4 min-w-[3rem] text-center">
            {sliderValue}
          </div> */}
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
  );
}
