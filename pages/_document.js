import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html>
			<Head>
				<html lang="en-us" />
				<meta charSet="utf-8" />
				<title>Randofy - Spotify Track Randomizer </title>
				<meta
					name="description"
					content="Generate a completely random track from Spotify with a click!"
				/>
				<link rel="preconnect" href="https://fonts.gstatic.com"></link>
				<link
					href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Poppins&family=Righteous&family=Rubik&family=JetBrains+Mono&display=swap"
					rel="stylesheet"></link>
				<meta
					name="google-site-verification"
					content="U0dN7iMS6_CGDy31qxDUYcDzAWx3Bl5WyQbG8of7tKQ"
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
