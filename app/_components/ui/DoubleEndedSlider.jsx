import { useState, useEffect } from "react";

export default function DoubleEndedSlider({
  label,
  value,
  onChange,
  valueStrings,
}) {
  const [localMin, setLocalMin] = useState(value.min);
  const [localMax, setLocalMax] = useState(value.max);

  useEffect(() => {
    setLocalMin(value.min);
    setLocalMax(value.max);
  }, [value]);

  const handleMinChange = (e) => {
    const newMin = parseFloat(e.target.value);
    if (newMin <= localMax && newMin <= 0.5) {
      setLocalMin(newMin);
      onChange({ min: newMin, max: localMax });
    }
  };

  const handleMaxChange = (e) => {
    const newMax = parseFloat(e.target.value);
    if (newMax >= localMin && newMax >= 0.5) {
      setLocalMax(newMax);
      onChange({ min: localMin, max: newMax });
    }
  };

  const leftPercent = `${localMin * 100}%`;
  const widthPercent = `${(localMax - localMin) * 100}%`;

  const minIndex = localMin <= 0.25 ? 0 : 1;
  const maxIndex = localMax <= 0.75 ? 2 : 3;

  // console.log(value, minIndex);

  return (
    <div className="flex flex-col w-full">
      <label className="font-body text-body-sm text-gray-600">{label}</label>

      {/* Slider text values */}
      <div className="flex justify-between font-body text-body-md text-gray-700 pb-2">
        <span className="font-body">
          {valueStrings[label.toLowerCase()][minIndex]}
        </span>
        <span className="font-body">
          {valueStrings[label.toLowerCase()][maxIndex]}
        </span>
      </div>

      <div className="relative w-full h-6">
        {/* Track Background */}
        <div className="absolute top-1/3 left-0 w-full h-1 bg-gray-300 rounded transform -translate-y-1/2" />

        {/* Highlighted Range */}
        <div
          className="absolute top-1/3 h-1 bg-gray-600 rounded transform -translate-y-1/2"
          style={{ left: leftPercent, width: widthPercent }}
        />

        {/* Max slider (bottom) */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={localMax}
          onChange={handleMaxChange}
          className="absolute w-full h-6 bg-transparent appearance-none slider-thumb z-10 touch-none"
        />

        {/* Min slider (top) */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={localMin}
          onChange={handleMinChange}
          className="absolute w-full h-6 bg-transparent appearance-none slider-thumb z-20 touch-none"
        />

        <style jsx>{`
          .slider-thumb::-webkit-slider-thumb {
            height: 16px;
            width: 16px;
            background: #e5e5e5;
            border: 2px solid white;
            border-radius: 50%;
            cursor: pointer;
            -webkit-appearance: none;
            pointer-events: auto;
            margin-top: -8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          }

          .slider-thumb::-moz-range-thumb {
            height: 16px;
            width: 16px;
            background: #e5e5e5;
            border: 2px solid white;
            border-radius: 50%;
            cursor: pointer;
            pointer-events: auto;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          }

          .slider-thumb::-webkit-slider-track,
          .slider-thumb::-moz-range-track {
            background: transparent;
            height: 4px;
          }
        `}</style>
      </div>
    </div>
  );
}
