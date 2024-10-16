"use client";
import { useState } from "react";
import Slider, { Range } from "rc-slider";
import styles from "./Slider.module.scss";
import "rc-slider/assets/index.css";

export default function FilterSlider({
  id,
  label,
  isRange,
  rangeLabels,
  min,
  max,
}) {
  const [range, setRange] = useState({ min: min, max: max });
  // const [values, setValues] = useState([range.min, range.max]);
  const step = 25;
  const defaultValue = !isRange ? min : [range.min, range.max];

  console.log(range, defaultValue);

  function changeValues() {}

  const handleMinChange = (e) => {
    e.preventDefault();
    const value = parseFloat(e.target.value);
    const newMinVal = Math.min(value, range.max - step);
    // if (value <= range.max - step) {
    setRange({ ...range, min: newMinVal });
    // }
  };

  const handleMaxChange = (e) => {
    e.preventDefault();
    const value = parseFloat(e.target.value);
    const newMaxVal = Math.max(value, range.min + step);
    // if (value <= range.min + step) {
    setRange({ ...range, max: newMaxVal });
    // }
  };

  const minPos = ((range.min - min) / (max - min)) * 100;
  const maxPos = ((range.max - min) / (max - min)) * 100;

  const isActiveMarker = (position) => {
    return position < minPos || position > maxPos;
  };

  console.log(minPos, maxPos, range.min, range.max);

  return (
    <div className={styles["range-container"]} x>
      {/* Change type of input here for a custom range */}
      <label className={styles["range-label"]} for={id}>
        {label}
      </label>
      {isRange ? (
        <div className={styles.wrapper}>
          <div className={styles["input-wrapper"]}>
            <input
              className={`${styles.slider} min`}
              type="range"
              id={id}
              name={id}
              min={min}
              max={max}
              step={25}
              onChange={handleMinChange}
              value={range.min}
            />
            <input
              className={`${styles.slider} max`}
              type="range"
              id={id}
              name={id}
              min={min}
              max={max}
              step={25}
              onChange={handleMaxChange}
              value={range.max}
            />
          </div>
          <div className={styles["control-wrapper"]}>
            <div className={styles.control} style={{ left: `${minPos}%` }} />
            <div
              className={styles["rail-wrapper"]}
              style={{ height: "100%", width: "100%" }}
            >
              <div className={styles.dot} style={{ left: "0%" }} />
              <div className={styles.dot} style={{ left: "25%" }} />
              <div className={styles.dot} style={{ left: "50%" }} />
              <div className={styles.dot} style={{ left: "75%" }} />
              <div className={styles.dot} style={{ left: "100%" }} />

              <div className={styles.rail}>
                <div
                  className={styles["inner-rail"]}
                  style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }}
                />
              </div>
            </div>
            <div className={styles.control} style={{ left: `${maxPos}%` }} />
          </div>
        </div>
      ) : (
        // <Slider
        //   range
        //   id={id}
        //   min={range.min}
        //   max={range.max}
        //   defaultValue={defaultValue}
        //   onChange={changeValues}
        //   step={25}
        //   dots={true}
        //   allowCross={false}
        // />
        <Slider
          id={id}
          min={range.min}
          max={range.max}
          defaultValue={defaultValue}
          onChange={changeValues}
          step={25}
          dots={true}
        />
      )}
    </div>
  );
}
