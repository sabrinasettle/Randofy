import { X } from "lucide-react";
import { useState } from "react";

export default function CloseButton({ closeFunction }) {
  const [isHover, setIsHover] = useState(false);

  function hoverOver() {
    setIsHover(!isHover);
  }
  return (
    <button
      className={isHover ? "close-btn close-btn__hover" : "close-btn"}
      onMouseEnter={hoverOver}
      onMouseLeave={hoverOver}
      onClick={closeFunction}
    >
      <X />
    </button>
  );
}
