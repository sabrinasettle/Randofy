import { useState, useEffect } from "react";

export default function DoubleEndedSlider({
  label,
  value,
  onChange,
  valueStrings,
}) {
  const [localMin, setLocalMin] = useState(value.min);
  const [localMax, setLocalMax] = useState(value.max);
  console.log("des", valueStrings);

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
          className="absolute w-full h-6 bg-transparent appearance-none pointer-events-none slider-thumb z-10"
        />

        {/* Min slider (top) */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={localMin}
          onChange={handleMinChange}
          className="absolute w-full h-6 bg-transparent appearance-none pointer-events-none slider-thumb z-20"
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

// export default function DoubleEndedSlider({
//   min,
//   max,
//   step = 1,
//   defaultMin,
//   defaultMax,
//   label,
//   formatValue = (value) => value.toString(),
//   onChange,
// }) {
//   const [minVal, setMinVal] = useState(defaultMin ?? min);
//   const [maxVal, setMaxVal] = useState(defaultMax ?? max);

//   // Notify parent when initialized or values change
//   useEffect(() => {
//     onChange?.({ min: minVal, max: maxVal });
//   }, [minVal, maxVal]);

//   const getPercent = (value) => ((value - min) / (max - min)) * 100;

//   const handleMinChange = (e) => {
//     const val = Math.min(Number(e.target.value), maxVal - step);
//     setMinVal(val);
//   };

//   const handleMaxChange = (e) => {
//     const val = Math.max(Number(e.target.value), minVal + step);
//     setMaxVal(val);
//   };

//   return (
//     <div className="max-w-md mx-auto p-6">
//       <label className="flex items-center gap-2 pb-3 text-sm font-medium text-gray-700">
//         <div className="px-2 py-1 border border-gray-300 rounded-sm text-heading-4 min-w-[3rem] text-center">
//           {formatValue(minVal)}
//         </div>
//         <span>-</span>
//         <div className="px-2 py-1 border border-gray-300 rounded-sm text-heading-4 min-w-[3rem] text-center">
//           {formatValue(maxVal)}
//         </div>
//         <span className="ml-auto text-heading-4">{label}</span>
//       </label>

//       <div className="relative w-full">
//         <div className="relative h-1 bg-gray-300 rounded">
//           <div
//             className="absolute h-1 bg-gray-600 rounded"
//             style={{
//               left: `${getPercent(minVal)}%`,
//               width: `${getPercent(maxVal) - getPercent(minVal)}%`,
//             }}
//           />
//           {/* Min thumb */}
//           <input
//             type="range"
//             min={min}
//             max={max}
//             step={step}
//             value={minVal}
//             onChange={handleMinChange}
//             className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none slider-thumb"
//             style={{ zIndex: 3 }}
//           />
//           {/* Max thumb */}
//           <input
//             type="range"
//             min={min}
//             max={max}
//             step={step}
//             value={maxVal}
//             onChange={handleMaxChange}
//             className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none slider-thumb"
//             style={{ zIndex: 2 }}
//           />
//         </div>
//       </div>

//       <style jsx>{`
//         .slider-thumb::-webkit-slider-thumb {
//           height: 16px;
//           width: 16px;
//           background: #e5e5e5;
//           border: 2px solid white;
//           border-radius: 50%;
//           cursor: pointer;
//           -webkit-appearance: none;
//           pointer-events: auto;
//           margin-top: -8px;
//           box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
//         }

//         .slider-thumb::-moz-range-thumb {
//           height: 16px;
//           width: 16px;
//           background: #e5e5e5;
//           border: 2px solid white;
//           border-radius: 50%;
//           cursor: pointer;
//           pointer-events: auto;
//           box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
//         }

//         .slider-thumb::-webkit-slider-track,
//         .slider-thumb::-moz-range-track {
//           background: transparent;
//           height: 4px;
//         }
//       `}</style>
//     </div>
//   );
// }
