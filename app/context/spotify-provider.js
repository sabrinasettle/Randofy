'use server';

import { SpotifyClientProvider } from './spotify-context';
export async function SpotifyDataProvider({ children }) {
	return <SpotifyClientProvider>{children}</SpotifyClientProvider>;
}
