"use client";
import { useState } from "react";
import { useSpotifyContext } from "../../context/spotify-context";
import Loading from "../Loading/Loading";
// import DoubleEndedSlider from "../ui/DoubleEndedSlider";
import FilterDrawer from "./FilterDrawer";
import GetSongsButton from "./GetSongsButton";

// Have a cancel button that abandons the search?? if isLoading
const GenerateButton = ({ spotifyClient }) => {
  return (
    <button
      id="generate"
      className="bg-gray-700 text-gray-000 text-heading-5 px-4 py-3 rounded-sm"
      onClick={spotifyClient.getSongs}
    >
      Get Songs
    </button>
  );
};

const FilterButton = ({ handleOpen }) => {
  return (
    <button
      className="bg-gray-100 px-4 py-3 rounded-sm text-gray-700 text-heading-5"
      onClick={() => handleOpen}
    >
      Filter Songs
    </button>
  );
};

// const FilterDrawer = () => {
//   const [sliderValue, setSliderValue] = useState(5);

//   const handleSliderChange = (e) => {
//     setSliderValue(parseInt(e.target.value));
//   };

//   return (
//     <div className="h-full absolute top-0 right-0 bg-gray-100 z-50 w-md border-gray-200 border-l">
//       <div className="flex flex-col p-6">
//         <div className="flex flex-row justify-between pb-10">
//           <h1>Filter Songs</h1>
//           <button className="text-gray-700">Close</button>
//         </div>
//         <div>
//           <div className="mb-6">
//             <label
//               htmlFor="custom-range"
//               className="flex flex-row items-center gap-2 pb-3"
//             >
//               <div className="py-1 px-2 border border-gray-300 rounded-sm text-gray-700 text-heading-4 min-w-[3rem] text-center">
//                 {sliderValue}
//               </div>
//               <p className="text-gray-700 text-heading-4">
//                 Totally random songs
//               </p>
//             </label>
//             <input
//               id="custom-range"
//               type="range"
//               min="5"
//               max="100"
//               value={sliderValue}
//               onChange={handleSliderChange}
//               className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
//             />
//           </div>

//           <style jsx>{`
//             .slider::-webkit-slider-thumb {
//               appearance: none;
//               height: 16px;
//               width: 16px;
//               border-radius: 50%;
//               background: #e5e5e5;
//               cursor: pointer;
//               border: none;
//               transition: background-color 0.3s ease;
//             }

//             .slider::-moz-range-thumb {
//               height: 16px;
//               width: 16px;
//               border-radius: 50%;
//               background: #e5e5e5;
//               cursor: pointer;
//               border: none;
//               transition: background-color 0.3s ease;
//             }

//             .slider::-webkit-slider-track {
//               height: 4px;
//               border-radius: 2px;
//             }

//             .slider::-moz-range-track {
//               height: 4px;
//               border-radius: 2px;
//             }

//             /* Progressive fill effect */
//             .slider {
//               background: linear-gradient(
//                 to right,
//                 #b2b2b2 0%,
//                 #b2b2b2 ${((sliderValue - 5) / 95) * 100}%,
//                 #4b4b4b ${((sliderValue - 5) / 95) * 100}%,
//                 #4b4b4b 100%
//               );
//               border-radius: 2px;
//             }
//           `}</style>
//         </div>

//         <div>
//           Song Details
//           <DoubleEndedSlider
//             min={0.0}
//             max={1.0}
//             step={0.01}
//             defaultMin={0.2}
//             defaultMax={0.8}
//             label="Opacity"
//             formatValue={(v) => `${(v * 100).toFixed(0)}%`}
//             onChange={(range) => console.log("Selected:", range)}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

const DefaultHome = () => {
  return (
    <div className="h-full max-w-[600px]">
      <h1 className="text-display-1 text-gray-700 pb-16">
        5 totally random songs from Spotify
      </h1>
    </div>
  );
};

export default function RandofyContent() {
  const { spotifyClient } = useSpotifyContext();
  const [filtersOpen, setFilterOpen] = useState(true);

  function showItem() {
    if (spotifyClient.isLoading) return <Loading />;
    else if (spotifyClient.currentSongs.length !== 0) return <SongList />;
    return (
      <div className="h-full max-w-[600px]">
        <h1 className="text-display-1 text-gray-700 pb-16">
          5 totally random songs from Spotify
        </h1>
      </div>
    );
  }

  return (
    <>
      <div className="content-container">{showItem()}</div>
      <div className="flex flex-row gap-4">
        <GetSongsButton isSmall={false} />
        <FilterButton handleOpen={() => setFilterOpen(!filtersOpen)} />
      </div>
      <FilterDrawer
        isOpen={filtersOpen}
        onClose={() => setFilterOpen(!filtersOpen)}
      />
    </>
  );
}
