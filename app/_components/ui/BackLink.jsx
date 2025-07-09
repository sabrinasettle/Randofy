"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackLink() {
  const router = useRouter();
  return (
    <button className="back-to btn-action" onClick={() => router.back()}>
      <span id="back-btn-content">
        <div id="icon__left-arrow">
          <ArrowLeft />
        </div>
        Back
      </span>
    </button>
  );
}
