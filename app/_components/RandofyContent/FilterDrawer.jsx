import { useState, useEffect, useMemo } from "react";
import { ChevronRight, ArrowLeft, X } from "lucide-react";
import DoubleEndedSlider from "../ui/DoubleEndedSlider";
import { useSpotifyContext } from "../../context/spotify-context";

// const Footer = ({}) => {
//   return (
//     <div className="w-full flex flex-row justify-between p-6">
//       <button
//         className="py-2 text-gray-400 hover:text-white transition-colors"
//         // onClick={clearFunction}
//       >
//         Clear
//       </button>
//       <button
//         className="px-6 py-2 bg-white text-black rounded transition-colors"
//         onClick={() => closeAndGet}
//       >
//         Get Songs
//       </button>
//     </div>
//   );
// };

export default function FilterDrawer({ isOpen, onClose }) {
  const [activePanel, setActivePanel] = useState("main");
  const [sliderValue, setSliderValue] = useState(5);
  const [isVisible, setIsVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  const { spotifyClient } = useSpotifyContext();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);

      // Ensure the drawer is rendered before transitioning
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimateIn(true);
        });
      });
    } else {
      setAnimateIn(false);

      // Delay unmount to let transition play
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 500); // matches transition duration

      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const handleSliderChange = (e) => {
    setSliderValue(parseInt(e.target.value));
    // update the filters through spotifyClient
  };

  const navigateToPanel = (panel) => {
    setActivePanel(panel);
  };

  const navigateBack = () => {
    setActivePanel("main");
  };

  const closeAndGet = () => {
    // spotifyClient.getSongs();
    onClose();
  };

  const setFilters = () => {};

  const renderMainView = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <h1 className="text-gray-700 text-lg font-medium">Filter Songs</h1>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>
      {/* Content */}
      <div className="flex-1 p-4">
        {/* Random Songs Slider */}
        <div className="mb-8">
          <label
            htmlFor="custom-range"
            className="flex flex-row items-center gap-2 pb-3"
          >
            <div className="py-1 px-2 border border-gray-300 rounded-sm text-gray-700 text-heading-4 min-w-[3rem] text-center">
              {sliderValue}
            </div>
            <p className="text-gray-700 text-heading-4">Totally random songs</p>
          </label>

          <div className="relative">
            <input
              id="custom-range"
              type="range"
              min="5"
              max="100"
              value={sliderValue}
              onChange={handleSliderChange}
              className="w-full h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer  slider"
            />
            <style jsx>{`
              .slider::-webkit-slider-thumb {
                appearance: none;
                height: 16px;
                width: 16px;
                border-radius: 50%;
                background: #e5e5e5;
                cursor: pointer;
                border: none;
              }
              .slider::-moz-range-thumb {
                height: 16px;
                width: 16px;
                border-radius: 50%;
                background: #e5e5e5;
                cursor: pointer;
                border: none;
              }
              .slider {
                background: linear-gradient(
                  to right,
                  #b2b2b2 0%,
                  #b2b2b2 ${((sliderValue - 5) / 95) * 100}%,
                  #4b4b4b ${((sliderValue - 5) / 95) * 100}%,
                  #4b4b4b 100%
                );
              }
            `}</style>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="space-y-0">
          <button
            onClick={() => navigateToPanel("songDetails")}
            className="w-full h-12 border-t border-gray-200 flex items-center justify-between px-0 transition-colors"
          >
            <span className="text-gray-700">Song Details</span>
            <ChevronRight size={16} className="text-gray-500" />
          </button>

          <button
            onClick={() => navigateToPanel("genres")}
            className="w-full h-12 border-t border-gray-200 flex items-center justify-between px-0 transition-colors"
          >
            <span className="text-gray-700">Genres</span>
            <ChevronRight size={16} className="text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderSongDetails = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <button
        onClick={navigateBack}
        className="flex items-center gap-4 p-4 text-gray-400 hover:text-white"
      >
        <ArrowLeft size={20} />{" "}
        <h1 className="text-white text-lg font-medium">Song Details</h1>
      </button>
      {/* </div> */}

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <DoubleEndedSlider
          label="Popularity"
          min={0}
          max={1}
          defaultMin={0.0}
          defaultMax={1.0}
          formatValue={(v) =>
            v === 0.1
              ? "Small dive bars"
              : v === 0.9
                ? "Massive concerts"
                : `${(v * 100).toFixed(0)}%`
          }
          onChange={(range) => console.log("Popularity:", range)}
        />

        <DoubleEndedSlider
          label="Acoustics"
          min={0}
          max={1}
          defaultMin={0.0}
          defaultMax={1.0}
          formatValue={(v) =>
            v === 0.2
              ? "Completely electronic"
              : v === 0.8
                ? "Totally acoustic"
                : `${(v * 100).toFixed(0)}%`
          }
          onChange={(range) => console.log("Acoustics:", range)}
        />

        <DoubleEndedSlider
          label="Energy"
          min={0}
          max={1}
          defaultMin={0.0}
          defaultMax={1.0}
          formatValue={(v) =>
            v === 0.3
              ? "Low and Moody"
              : v === 0.7
                ? "High and Joyful"
                : `${(v * 100).toFixed(0)}%`
          }
          onChange={(range) => console.log("Energy:", range)}
        />

        <DoubleEndedSlider
          label="Vocals"
          min={0}
          max={1}
          defaultMin={0.0}
          defaultMax={1.0}
          formatValue={(v) =>
            v === 0.1
              ? "No vocals"
              : v === 0.9
                ? "Only vocals"
                : `${(v * 100).toFixed(0)}%`
          }
          onChange={(range) => console.log("Vocals:", range)}
        />

        <DoubleEndedSlider
          label="Danceability"
          min={0}
          max={1}
          defaultMin={0.0}
          defaultMax={1.0}
          formatValue={(v) =>
            v === 0.2
              ? "No rhythm"
              : v === 0.8
                ? "Made for dancing"
                : `${(v * 100).toFixed(0)}%`
          }
          onChange={(range) => console.log("Danceability:", range)}
        />

        <DoubleEndedSlider
          label="Mood"
          min={0}
          max={1}
          defaultMin={0.0}
          defaultMax={1.0}
          formatValue={(v) =>
            v === 0.3
              ? "Low Energy"
              : v === 0.7
                ? "High Energy"
                : `${(v * 100).toFixed(0)}%`
          }
          onChange={(range) => console.log("Mood:", range)}
        />
      </div>
    </div>
  );

  const renderGenres = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      {/* <div className="flex items-center gap-4 p-4 "> */}
      <button
        onClick={navigateBack}
        className="flex items-center gap-4 p-4 text-gray-400 hover:text-white"
      >
        <ArrowLeft size={20} />
        <h1 className="text-white text-lg font-medium">Genres</h1>
      </button>
      {/* </div> */}

      {/* Content */}
      <div className="flex-1 p-6">
        <p>
          Disclaimer: *While Spotify identifies and works with thousands of
          subgenres these are the available genres to search against
        </p>
        <ul>{/* Alpha List */}</ul>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop for main content */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div
        className={`relative w-full lg:w-lg h-full bg-gray-000 shadow-xl transform transition-transform duration-500 [ease:cubic-bezier(0.16,1,0.3,1)] ${
          animateIn ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Panel Container with full-height layout and left border */}
        <div className="relative w-full h-full flex flex-col border-l border-gray-300">
          {/* Sliding Panels Wrapper (scrollable area) */}
          <div className="flex-1 relative overflow-hidden">
            {/* Main Panel */}
            <div
              className={`absolute inset-0 w-full h-full overflow-auto bg-gray-000 transition-transform duration-300 ease-in-out ${
                activePanel === "main" ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              {renderMainView()}
            </div>

            {/* Song Details Panel */}
            <div
              className={`absolute inset-0 w-full h-full overflow-auto bg-gray-000 transition-transform duration-300 ease-in-out ${
                activePanel === "songDetails"
                  ? "translate-x-0"
                  : "translate-x-full"
              }`}
            >
              {renderSongDetails()}
            </div>

            {/* Genres Panel */}
            <div
              className={`absolute inset-0 w-full h-full overflow-auto bg-gray-000 transition-transform duration-300 ease-in-out ${
                activePanel === "genres" ? "translate-x-0" : "translate-x-full"
              }`}
            >
              {renderGenres()}
            </div>
          </div>

          {/* Footer */}
          <div className="w-full flex flex-row justify-between px-4 py-4">
            <button
              className="py-2 text-gray-400 hover:text-white transition-colors"
              // onClick={clearFunction}
            >
              Clear
            </button>
            <button
              className="px-6 py-2 bg-gray-700 text-gray-000 rounded hover:bg-gray-200 transition-colors"
              onClick={() => closeAndGet()}
            >
              Get Songs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
