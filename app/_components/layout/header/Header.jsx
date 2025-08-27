"use client";
import Link from "next/link";
import AuthButton from "./AuthButton/AuthButton";
import InformationLink from "../InformationLink";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const styleClass = `font-body absolute top-0 left-0 w-full px-3 md:px-4 py-3 md:py-4 flex flex-row justify-between items-center bg-gray-000 z-40`;
  return (
    <nav className={styleClass}>
      <div className="flex flex-row items-center gap-2 md:gap-5">
        <Link
          href="/"
          className="flex flex-row px-1 py-1 rounded-sm transition-all duration-400 ease-in-out"
        >
          <Image
            src="/RandofyIcon - White 1.svg"
            unoptimized
            width={24}
            height={24}
            alt="Randofy Logo"
          />
        </Link>
        <Link
          href="/history"
          className={`font-body ${pathname === "/history" ? "text-gray-700" : "text-gray-600"} text-body-md hover:text-gray-700 transition-all duration-300 ease-in`}
        >
          History
        </Link>
        <Link
          href="/information"
          className={`font-body ${pathname === "/information" ? "text-gray-700" : "text-gray-600"} text-body-md hover:text-gray-700 transition-all duration-300 ease-in`}
        >
          Info
        </Link>
      </div>
      <div className="flex flex-row items-center gap-2">
        <AuthButton />
        {/* <InformationLink />*/}
      </div>
    </nav>
  );
}

// <nav className="fixed top-0 left-0 w-full px-5 py-5 flex flex-row justify-between items-center bg-gray-000">
