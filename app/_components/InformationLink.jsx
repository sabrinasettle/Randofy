import Link from "next/link";

export default function InformationLink() {
  return (
    <Link
      href="/information"
      className="absolute font-mono bg-gray-100 rounded-sm
bottom-[20px] right-[20px] px-2 py-1 text-gray-700"
    >
      i
    </Link>
  );
}
