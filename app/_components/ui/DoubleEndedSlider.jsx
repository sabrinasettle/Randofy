import { useState, useEffect } from "react";

/**
 * @param {Object} props
 * @param {number} props.min
 * @param {number} props.max
 * @param {number} [props.step]
 * @param {number} [props.defaultMin]
 * @param {number} [props.defaultMax]
 * @param {string} [props.label]
 * @param {(value: number) => string} [props.formatValue]
 * @param {(range: { min: number, max: number }) => void} [props.onChange]
 */
export default function DoubleEndedSlider({
  min,
  max,
  step = 1,
  defaultMin,
  defaultMax,
  label = "Range",
  formatValue = (value) => value.toString(),
  onChange,
}) {
  const [minVal, setMinVal] = useState(defaultMin ?? min);
  const [maxVal, setMaxVal] = useState(defaultMax ?? max);

  // Notify parent when initialized or values change
  useEffect(() => {
    onChange?.({ min: minVal, max: maxVal });
  }, [minVal, maxVal]);

  const getPercent = (value) => ((value - min) / (max - min)) * 100;

  const handleMinChange = (e) => {
    const val = Math.min(Number(e.target.value), maxVal - step);
    setMinVal(val);
  };

  const handleMaxChange = (e) => {
    const val = Math.max(Number(e.target.value), minVal + step);
    setMaxVal(val);
  };

  return (
    <div className="">
      <label className="flex items-center gap-2 pb-3 text-sm font-medium text-gray-700">
        <span className="ml-auto text-heading-4">{label}</span>
        <div className="px-2 py-1 border border-gray-300 rounded-sm text-heading-4 min-w-[3rem] text-center">
          {formatValue(minVal)}
        </div>
        <span>-</span>
        <div className="px-2 py-1 border border-gray-300 rounded-sm text-heading-4 min-w-[3rem] text-center">
          {formatValue(maxVal)}
        </div>
      </label>

      <div className="relative w-full">
        <div className="relative h-1 bg-gray-300 rounded">
          <div
            className="absolute h-1 bg-gray-600 rounded"
            style={{
              left: `${getPercent(minVal)}%`,
              width: `${getPercent(maxVal) - getPercent(minVal)}%`,
            }}
          />
          {/* Min thumb */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={minVal}
            onChange={handleMinChange}
            className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none slider-thumb"
            style={{ zIndex: 3 }}
          />
          {/* Max thumb */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={maxVal}
            onChange={handleMaxChange}
            className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none slider-thumb"
            style={{ zIndex: 2 }}
          />
        </div>
      </div>

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
          margin-top: -6px; /* Center over 4px track */
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
          margin-top: -6px; /* Same offset for Firefox */
        }

        .slider-thumb::-webkit-slider-runnable-track {
          height: 4px;
          background: transparent;
        }

        .slider-thumb::-moz-range-track {
          height: 4px;
          background: transparent;
        }
      `}</style>
    </div>
  );
}
