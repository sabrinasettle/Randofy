"use client";
import { useState } from "react";
export default function Info() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Button text={"info"} />
      <div className="info__content"></div>
    </div>
  );
}
