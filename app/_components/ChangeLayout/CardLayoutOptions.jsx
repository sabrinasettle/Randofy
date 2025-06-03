"use client";
import { useGridContext } from "../../context/card-layout-context";
import { LayoutGrid, LayoutList } from "lucide-react";
import { useState } from "react";

// const OblongGrid = ({}) => {
//   return (
//     <svg
//       id="oblong-icon"
//       width="24"
//       height="25"
//       viewBox="0 0 24 25"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M9 3.5H4C3.44772 3.5 3 3.94772 3 4.5V9.5V15.5V20.5C3 21.0523 3.44772 21.5 4 21.5H9C9.55228 21.5 10 21.0523 10 20.5V15.5V9.5V4.5C10 3.94772 9.55228 3.5 9 3.5Z"
//         // stroke="#FBFEF7"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <path
//         d="M20 3.5H15C14.4477 3.5 14 3.94772 14 4.5V9.5V15.5V20.5C14 21.0523 14.4477 21.5 15 21.5H20C20.5523 21.5 21 21.0523 21 20.5V15.5V9.5V4.5C21 3.94772 20.5523 3.5 20 3.5Z"
//         // stroke="#FBFEF7"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// };

export default function CardLayoutOptions() {
  const { layoutContext } = useGridContext();
  const [activeLayout, setActiveLayout] = useState(layoutContext.layoutType);

  // To Do
  // add animation to click change

  function handleOnClick(e) {
    let element = e.currentTarget;
    // console.log(element.id);
    layoutContext.changeLayout(element);
    setActiveLayout(element.id);
  }

  return (
    <div className="flex flex-row gap-1">
      <button
        className={`group pb-1 border-b transition-all duration-200 ${
          activeLayout === "list-grid"
            ? "border-gray-700 text-gray-700"
            : "border-transparent text-gray-500 hover:border-gray-700 hover:text-gray-700"
        }`}
        id="list-grid"
        onClick={handleOnClick}
      >
        <LayoutList className="group-hover:text-gray-700 transition-colors" />
      </button>
      <button
        className={`group pb-1 border-b transition-all duration-200 ${
          activeLayout === "square-grid"
            ? "border-gray-700 text-gray-700"
            : "border-transparent text-gray-500 hover:border-gray-700 hover:text-gray-700"
        }`}
        id="square-grid"
        onClick={handleOnClick}
      >
        <LayoutGrid className="group-hover:text-gray-700 transition-colors" />
      </button>
      {/* <button
        className={
          activeLayout === "oblong-grid"
            ? `layout-btn layout-btn__active`
            : `layout-btn layout-btn__inactive`
        }
        id="oblong-grid"
        onClick={handleOnClick}
      >
        <OblongGrid
          // id="oblong-grid"
          className="text-gray-500 group-hover:text-gray-700 transition-colors"
        />

        <div className="indictor-container">
          <div
            className={
              activeLayout === "oblong-grid"
                ? `active__indictor`
                : `active__indictor hidden`
            }
          />
        </div>
      </button> */}
    </div>
  );
}
