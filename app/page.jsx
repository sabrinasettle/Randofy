import SongList from './_components/SongList/SongList';
import Top from './_components/Top';
import Bottom from './_components/Bottom';
import { SpotifyClientProvider } from './context/spotify-context';

export default function Main() {
	return (
		<div>
			<SpotifyClientProvider>
				<Top />
				<SongList />
				<Bottom />
			</SpotifyClientProvider>
		</div>
	);
}
