// import GenerateButton from "./Generate/GenerateButton";
"use client";
import Link from "next/link";
import Title from "./Title/Title";

export default function Top() {
  return (
    <>
      <Title />
      <Link id="history-link" className="link" href={"/history"}>
        History
      </Link>
    </>
  );
}
