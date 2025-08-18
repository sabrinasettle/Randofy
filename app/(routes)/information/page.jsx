export default function Information() {
  return (
    <div className="w-full px-3 md:px-4 pt-[72px] flex flex-col lg:flex-row justify-between gap-28">
      <section className="font-body text-gray-700 w-full">
        <p className="text-display-2 pb-6">
          Built by{" "}
          <a
            href="https://github.com/sabrinasettle"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:italic"
          >
            Sabrina
          </a>{" "}
          and{" "}
          <a
            href="https://github.com/SLO42"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:italic"
          >
            Sam
          </a>
          ,<br /> a Setsa Studio product.
        </p>
        <p className="w-full md:w-[65%] pb-3">
          If you enjoy using Randofy, please consider supporting the app by
          buying us a coffee or sharing the product on your socials.
        </p>
        <div className="flex flex-col space-y-2">
          <a
            className="underline hover:italic"
            href="https://buymeacoffee.com/setsa_studio"
          >
            Click here to support us (with money)
          </a>
          {/* Add socials when they get created */}
          {/* OR support us (by sharing) */}
        </div>
      </section>
      <section className="font-body text-gray-700 w-full md:w-6/8">
        <h2 className="text-heading-3 pb-4">Data & Privacy Disclaimer</h2>
        <p className="text-body-md pb-4">
          This application uses the Spotify Web API to provide music-related
          features and functionality. Here’s how we handle your data:
        </p>
        <ul className="list-disc list-inside text-balance text-body-md">
          <li className="py-1">
            <b>Spotify Integration:</b> The app may request access to certain
            Spotify data—like your public playlists or listening activity—but
            only if needed to enable specific features. Access is granted
            through Spotify's secure authorization system and never without your
            explicit permission.
          </li>

          <li className="py-1">
            <b>No Data Selling:</b> We do not sell, trade, or share any personal
            data or Spotify account information with third parties.
          </li>

          <li className="py-1">
            <b>No Cookies:</b> This app does not use cookies or any form of
            tracking technologies for analytics, advertising, or user profiling.
          </li>

          <li className="py-1">
            <b>Data Use Limitation:</b> All data accessed through the Spotify
            API is used only within the app experience and is not stored beyond
            what is required for functionality.
          </li>

          <li className="py-1">
            <b>Spotify Terms:</b> Use of this application is also subject to
            Spotify’s{" "}
            <a
              className="underline"
              href="https://www.spotify.com/us/legal/end-user-agreement/"
            >
              Terms of Service
            </a>
            ,{" "}
            <a
              className="underline"
              href="https://developer.spotify.com/policy"
            >
              Developer Policy
            </a>
            , and{" "}
            <a
              className="underline"
              href="https://www.spotify.com/us/legal/privacy-policy/"
            >
              Privacy Policy
            </a>
            .
          </li>
        </ul>
        <p className="w-full pt-4">
          We are committed to respecting your privacy and maintaining a
          transparent, secure, and ad-free experience.
        </p>
      </section>
    </div>
  );
}
