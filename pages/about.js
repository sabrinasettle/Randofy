import React from 'react';
import Head from 'next/head';
import Link from '@material-ui/core/Link';
import styles from '../styles/About.module.scss'
import Header from '../components/Header';
import Footer from '../components/Footer';

class About extends React.Component {
    
    quoteOptions = () => {
            let array = [
            {
                quote: "Music was my refuge. I could crawl into the space between the notes and curl my back to loneliness.",
                author: "Maya Angelou",
                source: null,
            },
            {
                quote: "Music is the strongest form of magic.",
                author: "Marilyn Manson",
                source: null
            },
            // {
            //     quote: "I Wanna Hold Your Hand.’ First single. Fucking brilliant. Perhaps the most fucking brilliant song ever written. Because they nailed it. That’s what everyone wants. Not 24-7 hot wet sex. Not a marriage that lasts a hundred years. Not a Porsche or a blow job or a million-dollar crib. No. They wanna hold your hand. They have a feeling that they can’t hide.",
            //     author: "Rachel Cohn",
            //     source: "Nick & Norah's Infinite Playlist",
            // },
            {
                quote: "I love the relationship that anyone has with music ... because there's something in us that is beyond the reach of words, something that eludes and defies our best attempts to spit it out. ... It's the best part of us probably ...",
                author: "Nick Hornby", 
                source:"Songbook",
            },
            {
                quote: "It is always fatal to have music or poetry interrupted.",
                author: "George Eliot",
                source:"Middlemarch",
            },
            {
                quote: "And mostly all I have to say about these songs is that I love them, and want to sing along to them, and force other people to listen to them, and get cross when other people don't like them as much as I do.",
                author: "Nick Hornby", 
                source: "Songbook"
            },
            {
                quote: "After silence, that which comes nearest to expressing the inexpressible is music.",
                author: "Aldous Huxley",
                source: "Music at Night and Other Essays"
            },
            {
                quote: "If I had my life to live over again, I would have made a rule to read some poetry and listen to some music at least once every week.",
                author: "Charles Darwin", 
                source: "The Autobiography of Charles Darwin, 1809–82",
            },
            {
                quote: "The only truth is music.",
                author: "Jack Kerouac",
                source: null
            },
            {
                quote: "Music is the great uniter. An incredible force. Something that people who differ on everything and anything else can have in common.",
                author: "Sarah Dessen",
                source: "Just Listen"
            },
        ]
        return array;
    }

    randomizeQuote = () => {
        let array = this.quoteOptions();
        const random = Math.floor(Math.random() * array.length);
        return (array[random]);
    };

    render(){
        const quote = this.randomizeQuote();
        return(
            <>
                <Head>
                    <html lang='en-us' />
                    <meta charSet="utf-8" />
                    <title>Randofy</title>
                    <meta name="description" content="About Randofy and its purpose" />
                    <link rel="preconnect" href="https://fonts.gstatic.com"></link>
                    <link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Poppins&family=Righteous&family=Rubik&family=JetBrains+Mono&display=swap" rel="stylesheet"></link>
                </Head>
                <Header />
                <div id={styles.grid}>
                    <div className={styles.section} id={styles.dict}>
                        <h2>
                            <p id={styles.term}>melomaniac</p>
                            <p id={styles.from}>in British English</p>
                            <p id={styles.prounce}>(ˌmɛləˈmeɪnɪæk)</p>
                            <p id={styles.type}>NOUN</p>
                            <p id={styles.def}>
                                a person with a great enthusiasm for music
                            </p>
                        </h2>
                    </div>

                    {/* If user than show their username here */}
                    {this.props.spotifyUser ? <h1 className={styles.title}>Hi {this.props.spotifyUser.spotifyUser.display_name}</h1> : <h1 className={styles.title}>Hi There!</h1>}
                    <div className={styles.section} id={styles.about}>
                        <h1 className={styles.title + ' ' + styles.subtitle}>About</h1>
                        <p>
                            This site was created by two web developers with eclectic music taste and it’s for everyone who has ever been stumped to what to listen or just restless within their own known discography. It generates a new random song from the Spotify database, and while we use their resources the information can be easily used to find songs on YouTube.
                        </p>
                        <p>
                            You can check out our Randofy finds <Link href="https://open.spotify.com/playlist/1fehOuEhzy0BS64ji8hmhU">here</Link> and <Link href="https://open.spotify.com/playlist/2BTnvHQf3DuoKMXI6LFMmS">here</Link>!
                        </p>
                        <p>
                            If you are interested in reaching us we can be reached on <Link>Twitter</Link>.
                        </p>
                        <p>
                            Find us on Github <Link>here</Link> and <Link>here</Link>.
                        </p>
                    </div>
                    <div className={styles.section} id= {styles.usage}>
                        <h1 className={styles.title + ' ' + styles.subtitle}>Usage</h1>
                        We use Spotify to authenicate our users and on signin a Randofy playlist will be created so that its an easy home for any songs generated that you wanna listen to later.
                    </div>
                    <div className={styles.section} id={styles.legal}>
                        <h1 className={styles.title + ' ' + styles.subtitle}>Legal</h1>
                        We will not keep nor use your personal data in anyway, BTW.
                    </div>
                    <div className={styles.section} id={styles.quotes}>
                        <p id={styles.quote}>"{quote.quote}"</p>
                        <span>
                            {quote.source ? <p id={styles.author}>{quote.author}, {quote.source} </p> : <p id={styles.author}>{quote.author}</p>}
                        </span>
                    </div>
                </div>
                <Footer />
            </>
        )
    }
}

export default About;