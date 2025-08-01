"use client";
import { useState, useEffect, useMemo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import CardGrid from "./CardGrid";
// import { useGridContext } from "../../../context/card-layout-context";

export default function HistorySection({ date, songs, idIndex }) {
  const [isOpen, setIsOpen] = useState(true);

  function toggleSection() {
    setIsOpen(!isOpen);
  }

  // useEffect(() => console.log("mounted"), []);

  function isToday() {
    const today = new Date();
    let dateString = today.toLocaleDateString();
    return date === dateString;
  }

  // const styled = useMemo(() => {
  //   if (isActive) {
  //     return "section-header__active";
  //   } else {
  //     return "section-header";
  //   }
  // }, [isActive]);

  // To Do
  // Animate the date getting bigger as the user scrolls
  //  // add listener to scroll
  // animate the close and open of the section
  // Add loader to view so that the user gets something

  const formatDate = (input) => {
    const [month, day, year] = input.split("/").map(Number);
    const date = new Date(year, month - 1, day);

    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <li id={idIndex} className="font-body">
      <div id={`${idIndex}-header`}>
        {/* <div className="">
          <h2>{isToday() ? "Today" : `${date}`}</h2>
          <button className="" onClick={toggleSection}>
            {isOpen ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div> */}
        <div className="group flex flex-row justify-between w-full">
          <div className="flex flex-row gap-2 pb-6">
            <h2 className="text-heading-4 text-gray-700">
              {isToday() ? "Today" : `${formatDate(date)}`}
            </h2>
            <p className="text-gray-600">[{songs.length}]</p>
          </div>
          <button
            className="text-gray-400 group-hover:text-gray-700"
            onClick={toggleSection}
          >
            {isOpen ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>
      </div>
      {isOpen && <CardGrid songs={songs} />}
    </li>
  );
}
