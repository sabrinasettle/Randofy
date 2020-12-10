import '../styles/globals.scss'
import App, { Container } from 'next/app';

import NoteProvider from '../components/spotifyUser';

function MyApp({ Component, pageProps }) {
  return (
    <NoteProvider>
      <Component {...pageProps} />
    </NoteProvider>
  );
}

export default MyApp
