"use client";
import { useEffect, useState } from "react";

export default function CounterText() {
  const [counter, setCounter] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const res = await fetch("/api/counter");
      const data = await res.json();
      if (mounted) setCounter(data.counter);
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  if (counter === null) return <p>—</p>;

  return (
    <p className=" text-gray-700">This site has randomized {counter} songs</p>
  );
}
