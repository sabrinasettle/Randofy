import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function Tooltip({ children, text, className = "" }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [buttonRect, setButtonRect] = useState(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkIfTouch = () =>
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0;

    setIsTouch(checkIfTouch());
  }, []);

  const handleMouseEnter = (e) => {
    if (isTouch) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setButtonRect(rect);
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    if (isTouch) return;
    setShowTooltip(false);
  };

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={className}
      >
        {children}
      </div>

      {!isTouch &&
        showTooltip &&
        buttonRect &&
        createPortal(
          <div
            className="fixed bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm whitespace-nowrap z-50 pointer-events-none"
            style={{
              left: buttonRect.left + buttonRect.width / 2,
              top: buttonRect.bottom + 12,
              transform: "translateX(-50%)",
            }}
          >
            {text}
          </div>,
          document.body,
        )}
    </>
  );
}
