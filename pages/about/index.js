'use client';

import React from 'react';
import Link from '@mui/material/Link';
import styles from '../../styles/About.module.scss';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { SpotifyContext } from '../../context';

const quotes = [
	{
		quote:
			'Music was my refuge. I could crawl into the space between the notes and curl my back to loneliness.',
		author: 'Maya Angelou',
		source: null,
	},
	{
		quote: 'Music is the strongest form of magic.',
		author: 'Marilyn Manson',
		source: null,
	},
	{
		quote:
			"I love the relationship that anyone has with music ... because there's something in us that is beyond the reach of words, something that eludes and defies our best attempts to spit it out. ... It's the best part of us probably ...",
		author: 'Nick Hornby',
		source: 'Songbook',
	},
	{
		quote: 'It is always fatal to have music or poetry interrupted.',
		author: 'George Eliot',
		source: 'Middlemarch',
	},
	{
		quote:
			"And mostly all I have to say about these songs is that I love them, and want to sing along to them, and force other people to listen to them, and get cross when other people don't like them as much as I do.",
		author: 'Nick Hornby',
		source: 'Songbook',
	},
	{
		quote:
			'After silence, that which comes nearest to expressing the inexpressible is music.',
		author: 'Aldous Huxley',
		source: 'Music at Night and Other Essays',
	},
	{
		quote:
			'If I had my life to live over again, I would have made a rule to read some poetry and listen to some music at least once every week.',
		author: 'Charles Darwin',
		source: 'The Autobiography of Charles Darwin, 1809–82',
	},
	{
		quote: 'The only truth is music.',
		author: 'Jack Kerouac',
		source: null,
	},
	{
		quote:
			'Music is the great uniter. An incredible force. Something that people who differ on everything and anything else can have in common.',
		author: 'Sarah Dessen',
		source: 'Just Listen',
	},
];

function About({ ...props }) {
	const randomizeQuote = () => {
		const random = Math.floor(Math.random() * quotes.length);
		return quotes[random];
	};
	const quote = randomizeQuote();
	return (
		<>
			<link
				href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Poppins&family=Righteous&family=Rubik&family=JetBrains+Mono&display=swap"
				rel="stylesheet"></link>
			<SpotifyContext.Consumer>
				{spotifyUser =>
					spotifyUser && spotifyUser.spotifyUser ? (
						<div>
							<Header spotifyUser={spotifyUser} />
						</div>
					) : (
						<div>
							<Header spotifyUser={null} />
						</div>
					)
				}
			</SpotifyContext.Consumer>
			<div id={styles.grid}>
				<div className={styles.section} id={styles.dict}>
					<h2>
						<p id={styles.term}>melomaniac</p>
						<p id={styles.from}>in British English</p>
						<p id={styles.prounce}>(ˌmɛləˈmeɪnɪæk)</p>
						<p id={styles.type}>NOUN</p>
						<p id={styles.def}>a person with a great enthusiasm for music</p>
					</h2>
				</div>

				{/* If user than show their username here */}
				{props.spotifyUser ? (
					<h1 className={styles.title}>
						Hi {this.props.spotifyUser.spotifyUser.display_name}
					</h1>
				) : (
					<h1 className={styles.title}>Hi There!</h1>
				)}
				<div
					suppressHydrationWarning={true}
					className={styles.section}
					id={styles.about}>
					<h1 className={styles.title + ' ' + styles.subtitle}>About</h1>
					<p suppressHydrationWarning={true}>
						This site was created by two web developers with eclectic music
						taste and it’s for everyone who has ever been stumped to what to
						listen or just restless within their own known discography. It
						generates a new random song from the Spotify database, and while we
						use their resources the information can be easily used to find songs
						on YouTube.
					</p>
					<div>
						<p>
							You can check out our Randofy finds
							<Link href="https://open.spotify.com/playlist/1fehOuEhzy0BS64ji8hmhU">
								here
							</Link>{' '}
							and{' '}
							<Link href="https://open.spotify.com/playlist/2BTnvHQf3DuoKMXI6LFMmS">
								here
							</Link>
							!
						</p>
					</div>
					<p>
						If you are interested in reaching us we can be reached on{' '}
						<Link>Twitter</Link>.
					</p>
					<span>
						Find us on Github{' '}
						<Link href="https://github.com/settleformore" target="_blank">
							here
						</Link>{' '}
						and{' '}
						<Link href="https://github.com/SLO42" target="_blank">
							here
						</Link>
						.
					</span>
				</div>
				<div className={styles.section} id={styles.usage}>
					<h1 className={styles.title + ' ' + styles.subtitle}>Usage</h1>
					We use Spotify to authenicate our users and on signin a Randofy
					playlist will be created so that its an easy home for any songs
					generated that you wanna listen to later.
				</div>
				<div className={styles.section} id={styles.legal}>
					<h1 className={styles.title + ' ' + styles.subtitle}>Legal</h1>
					We will not keep nor use your personal data in anyway, BTW.
				</div>

				<div
					suppressHydrationWarning={true}
					className={styles.section}
					id={styles.quotes}>
					<h2 suppressHydrationWarning={true} id={styles.quote}>
						"{quote.quote}"
					</h2>
					{quote.source ? (
						<p suppressHydrationWarning={true} id={styles.author}>
							{`${quote.author}, ${quote.source}, `}
						</p>
					) : (
						<p suppressHydrationWarning={true} id={styles.author}>
							{quote.author}
						</p>
					)}
				</div>
			</div>
			<Footer />
		</>
	);
}

export default About;
