import SongList from "./_components/SongList/SongList";
import Top from "./_components/Top";
import Bottom from "./_components/Bottom";
import { SpotifyDataProvider } from "./context/spotify-provider";

export default function Main() {
  return (
    <div>
      <SpotifyDataProvider>
        <Top />
        <SongList />
        <Bottom />
      </SpotifyDataProvider>
    </div>
  );
}
