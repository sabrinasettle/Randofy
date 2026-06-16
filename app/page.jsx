import RandofyContent from "./_components/main_page/RandofyContent";
// import InformationLink from "./_components/layout/InformationLink";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Randofy",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web",
  url: "https://randofy.vercel.app",
  description:
    "Randofy is a random song finder for Spotify that helps listeners generate unexpected tracks, discover deep cuts, and save favorite finds.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Find random songs from Spotify's catalog",
    "Filter random tracks by genre and audio features",
    "Save discovered songs to a Spotify playlist",
  ],
};

export default function Main() {
  // min-h-[calc(100vh-80px)]
  return (
    <main className="flex h-dvh flex-col items-center justify-center px-4 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <RandofyContent />
    </main>
  );
}
