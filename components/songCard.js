import React from 'react'
import styles from '../styles/SongCard.module.scss'


// Card for song data from Spotify
class SongCard extends React.Component {
    constructor(props){
        super(props);
        console.log(props);
        this.state = { 
            // isLoaded: false,
            visible: false,
        };
    }

    // has soon as it has data it becomes visible

    render() {
        console.log("data in card", this.props.data)
        const o_sys = window.navigator.platform
        return (
            <div className={styles.card}>
                <div className={`${styles.section} ${styles.ablumcover}`}>
                    <img
                        src={this.props.data.album_image.url}
                        alt={this.props.data.track_name}
                        className={styles.ablumcover}
                    />
                </div>
                <div className={`${styles.section} ${styles.info}`}>
                    <p className={styles.title}> {this.props.data.track_name}</p>
                    <p className={styles.artist}> {this.props.data.track_artist}</p>
                    <p className={styles.album}> {this.props.data.album_name}</p>
                    <p>{this.props.data.is_explicit ? 'Explicit' : 'Nonexplicit'}</p>
                    <p>Number of attempts to get this song: {this.props.data.attempts}</p>
                </div>
                {/* <div className={`${styles.section} ${styles.spotify}`}>
                    <a href='https://spotify-randomizer-backend.herokuapp.com/login'>Listen On Spotify</a>
                </div> */}
            </div>
        )
    }
};

export default SongCard;