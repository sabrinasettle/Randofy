import '../styles/globals.scss';
import React from 'react';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<title>Randofy - Spotify Track Randomizer </title>
			</Head>
			<Component {...pageProps} />;
		</>
	);
}

export default MyApp;
