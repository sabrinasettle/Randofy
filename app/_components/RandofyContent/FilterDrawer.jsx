import { useState } from "react";
import { ChevronRight, ArrowLeft, X } from "lucide-react";
import DoubleEndedSlider from "../ui/DoubleEndedSlider";
import GetSongsButton from "./GetSongsButton";
import { useSpotifyContext } from "../../context/spotify-context";

const Footer = ({}) => {
  return (
    <div className="w-full flex flex-row justify-between p-6">
      <button
        className="py-2 text-gray-400 hover:text-white transition-colors"
        // onClick={clearFunction}
      >
        Clear
      </button>
      <button
        className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
        onClick={() => closeAndGet}
      >
        Get Songs
      </button>
    </div>
  );
};

export default function FilterDrawer({ isOpen, onClose }) {
  const [activePanel, setActivePanel] = useState("main");
  const [sliderValue, setSliderValue] = useState(5);
  const { spotifyClient } = useSpotifyContext();

  const handleSliderChange = (e) => {
    setSliderValue(parseInt(e.target.value));
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

  const renderFooter = () => {
    // <div className="w-full flex flex-row justify-between p-6">
    <div>
      <button
        className="py-2 text-gray-400 hover:text-white transition-colors"
        // onClick={clearFunction}
      >
        Clear
      </button>
      <button
        className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
        onClick={() => closeAndGet}
      >
        Get Songs
      </button>
    </div>;
  };

  const renderMainView = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <h1 className="text-gray-700 text-lg font-medium">Filter Songs</h1>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>
      {/* Content */}
      <div className="flex-1 p-6">
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
              className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
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
                  #4b5563 ${((sliderValue - 5) / 95) * 100}%,
                  #4b5563 100%
                );
              }
            `}</style>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="space-y-0">
          <button
            onClick={() => navigateToPanel("songDetails")}
            className="w-full h-12 border-t border-gray-300 flex items-center justify-between px-0 hover:bg-gray-300 transition-colors"
          >
            <span className="text-gray-700">Song Details</span>
            <ChevronRight size={16} className="text-gray-500" />
          </button>

          <button
            onClick={() => navigateToPanel("genres")}
            className="w-full h-12 border-t border-gray-300 flex items-center justify-between px-0 hover:bg-gray-300 transition-colors"
          >
            <span className="text-gray-700">Genres</span>
            <ChevronRight size={16} className="text-gray-500" />
          </button>
        </div>
      </div>
      <div className="w-full flex flex-row justify-between p-6">
        <button
          className="py-2 text-gray-400 hover:text-white transition-colors"
          // onClick={clearFunction}
        >
          Clear
        </button>
        <button
          className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
          onClick={() => closeAndGet}
        >
          Get Songs
        </button>
      </div>
      ;
    </div>
  );

  const renderSongDetails = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b border-gray-700">
        <button
          onClick={navigateBack}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-white text-lg font-medium">Song Details</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <DoubleEndedSlider
          label="Popularity"
          min={0}
          max={1}
          defaultMin={0.1}
          defaultMax={0.9}
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
          defaultMin={0.2}
          defaultMax={0.8}
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
          defaultMin={0.3}
          defaultMax={0.7}
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
          defaultMin={0.1}
          defaultMax={0.9}
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
          defaultMin={0.2}
          defaultMax={0.8}
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
          defaultMin={0.3}
          defaultMax={0.7}
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

      {/* Footer */}
      <div className="p-6 border-t border-gray-700 flex gap-3">
        <button className="flex-1 py-2 text-gray-400 hover:text-white transition-colors">
          Clear
        </button>
        <button className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors">
          Get Songs
        </button>
      </div>
    </div>
  );

  const renderGenres = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b border-gray-700">
        <button
          onClick={navigateBack}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-white text-lg font-medium">Genres</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <p className="text-gray-400">
          Genre selection interface would go here...
        </p>
      </div>

      {/* Footer */}
      <div className="w-full flex flex-row justify-between p-6">
        <button className="py-2 text-gray-400 hover:text-white transition-colors">
          Clear
        </button>
        <button
          className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
          onClick={() => closeAndGet}
        >
          Get Songs
        </button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop for main content*/}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-96 h-full bg-gray-200 ">
        {/* Panel Container with sliding animation */}
        <div className="relative w-full h-full overflow-hidden">
          {/* Main Panel */}
          <div
            className={`absolute inset-0 w-full h-full bg-gray-100 transition-transform duration-300 ease-in-out ${
              activePanel === "main" ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {renderMainView()}
          </div>

          {/* Song Details Panel */}
          <div
            className={`absolute inset-0 w-full h-full bg-gray-100 transition-transform duration-300 ease-in-out ${
              activePanel === "songDetails"
                ? "translate-x-0"
                : "translate-x-full"
            }`}
          >
            {renderSongDetails()}
          </div>

          {/* Genres Panel */}
          <div
            className={`absolute inset-0 w-full h-full bg-gray-100 transition-transform duration-300 ease-in-out ${
              activePanel === "genres" ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {renderGenres()}
          </div>
        </div>
      </div>
    </div>
  );
}
