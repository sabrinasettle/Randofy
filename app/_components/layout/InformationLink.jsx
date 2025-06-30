import Link from "next/link";

export default function InformationLink() {
  return (
    <Link
      href="/information"
      className="font-mono absolute bg-gray-100 rounded-sm
bottom-[20px] right-[20px] px-2 py-1 text-gray-700 border border-transparent hover:border-gray-200 z-20"
    >
      i
    </Link>
  );
}
