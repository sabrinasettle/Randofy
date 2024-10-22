"use client";
import Link from "next/link";
import { useSpotifyContext } from "../../context/spotify-context";
import HistorySection from "./HistorySection/HistorySection";

export default function HistoryContent() {
  const { spotifyClient } = useSpotifyContext();
  let history = spotifyClient.generationHistory;
  console.log(history);
  //see if content has loaded as well

  // iteriate through the object
  //
  for (const key in history) {
    console.log(key, history[key].songs);
  }

  // To Do
  // Create Filters for the history (All, Today, This Week, This Month, Past 6 Months)

  return (
    <main>
      <Link href={"/"}>Back</Link>
      <div>
        <ul>
          {Object.keys(history)?.map((key, index) => (
            <HistorySection date={key} songs={history[key]} />
          ))}
        </ul>
      </div>
    </main>
  );
}
