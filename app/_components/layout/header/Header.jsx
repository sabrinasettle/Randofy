"use client";
import Link from "next/link";
import AuthButton from "./AuthButton/AuthButton";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const styleClass =
    pathname === "/" || "/information"
      ? `static w-full px-3 md:px-4 py-3 md:py-4 flex flex-row justify-between items-center bg-gray-000`
      : `sticky top-0 left-0 w-full px-3 md:px-4 py-3 md:py-4 flex flex-row justify-between items-center bg-gray-000 z-20">
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
          />
        </Link>
        <AuthButton />
      </div>
      {/* <div className="flex flex-row items-center gap-2"> */}
      <Link
        href="/history"
        className="text-gray-700 text-body-md hover:underline transition-all duration-400 ease-in"
      >
        History
      </Link>
      {/* <AuthButton /> */}
      {/* </div> */}
    </nav>
  );
}

// <nav className="fixed top-0 left-0 w-full px-5 py-5 flex flex-row justify-between items-center bg-gray-000">
