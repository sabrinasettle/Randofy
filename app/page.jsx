import RandofyContent from "./_components/main_page/RandofyContent";
// import InformationLink from "./_components/layout/InformationLink";

export default function Main() {
  // min-h-[calc(100vh-80px)]
  return (
    <main className="flex h-screen flex-col items-center justify-center px-4 overflow-hidden">
      <RandofyContent />
    </main>
  );
}
