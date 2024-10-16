"use client";
import { useState } from "react";
import { XIcon } from "lucide-react";
import FilterSlider from "../../Slider/FilterSlider";
import styles from "../Bottom.module.scss";
// filter box is fixed, z-index 50,
// button is absolute
export default function Filter() {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);

  function handleOpen() {
    setIsActive(!isActive);
    setIsOpen(!isOpen);
  }

  let defaultFilters = {
    numberOfSongs: 5,
    popularity: [0, 100],
    acousticness: [0.0, 1.0], //float range from 0.0 to 1.0
    danceability: [0.0, 1.0], //float range from 0.0 to 1.0
    energy: [0.0, 1.0], //float range from 0.0 to 1.0
    tempo: [0.0, 1.0], //float range from 0.0 to 1.0
    valence: [0.0, 1.0], //float range from 0.0 to 1.0
    speechiness: [0.0, 1.0], //float range from 0.0 to 1.0
    market: "",
  };

  return (
    <>
      {isOpen && (
        <div className={styles["filter-modal"]}>
          <div className="close-modal" onClick={handleOpen}>
            <XIcon />
          </div>
          <FilterSlider
            label="Number of Songs"
            min={5}
            max={100}
            id="number-of-songs"
            isRange={false}
            rangeLabels={[5, 25, 50, 75, 100]}
          />
          <FilterSlider
            label="Acoustics"
            min={0}
            max={100}
            id="acoustics"
            isRange="true"
            rangeLabels={["no acoutics", "all the acoutics"]}
          />
          <FilterSlider
            label="Energy"
            min={0}
            max={100}
            id="energy"
            isRange="true"
            rangeLabels={["no acoutics", "all the acoutics"]}
          />
          <FilterSlider
            label="Danceable"
            min={0}
            max={100}
            id="dance-dance"
            isRange="true"
            rangeLabels={["no acoutics", "all the acoutics"]}
          />
          <FilterSlider
            label="Mood"
            min={0}
            max={100}
            id="mood"
            isRange="true"
            rangeLabels={["no acoutics", "all the acoutics"]}
          />
          <FilterSlider
            label="Popularity"
            min={0}
            max={100}
            id="popularity"
            isRange="true"
            rangeLabels={["no acoutics", "all the acoutics"]}
          />
          <FilterSlider
            label="Tempo"
            min={0}
            max={100}
            id="tempo"
            isRange="true"
            rangeLabels={["no acoutics", "all the acoutics"]}
          />
          <FilterSlider
            label="Vocals"
            min={0}
            max={100}
            id="vocals"
            isRange="true"
            rangeLabels={["no acoutics", "all the acoutics"]}
          />
        </div>
      )}

      <button
        id={styles["filter-btn"]}
        className={
          !isActive
            ? `btn btn__overlay text-sm`
            : `btn btn__overlay btn__active text-sm`
        }
        onClick={handleOpen}
      >
        Filter
      </button>
    </>
  );
}
