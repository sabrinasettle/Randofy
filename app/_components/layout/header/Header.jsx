"use client";
import Link from "next/link";
import AuthButton from "./AuthButton/AuthButton";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const styleClass =
    pathname === "/" || "/information"
      ? `font-body absolute top-0 left-0 w-full px-3 md:px-4 py-3 md:py-4 flex flex-row justify-between items-center bg-gray-000 z-40`
      : `font-body sticky top-0 left-0 w-full px-3 md:px-4 py-3 md:py-4 flex flex-row justify-between items-center bg-gray-000 z-20">
`;
  return (
    <nav className={styleClass}>
      <div className="flex flex-row items-center gap-2">
        <Link
          href="/"
          className="px-1 py-1 rounded-sm transition-all duration-400 ease-in-out"
        >
          <Image
            src="/RandofyIcon - White 1.svg"
            unoptimized
            width={24}
            height={24}
            alt="Randofy Logo"
          />
        </Link>
        <AuthButton />
      </div>
      {/* <div className="flex flex-row items-center gap-2"> */}
      <Link
        href="/history"
        className="font-body text-gray-600 text-body-md hover:text-gray-700 hover:underline transition-all duration-300 ease-in"
      >
        History
      </Link>
      {/* <AuthButton /> */}
      {/* </div> */}
    </nav>
  );
}

// <nav className="fixed top-0 left-0 w-full px-5 py-5 flex flex-row justify-between items-center bg-gray-000">
