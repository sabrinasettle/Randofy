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
    fontSize = () => {
        // test string title
        var testTitle = `Ce soir, mon amour - De l'opérette "Violettes impériales" ; Remasterisé en 2018`
        var title = this.props.data.track_name
        const base = 40
        let testLen
        if (title){
            if (title.length >= 20){
                return('20px');
            } else if (title.length <= 19 && title.length >= 10){
                return ('30px')
            }   
            else if (title.length >= 10){
                return ('40px')
            }          
        }
    }

    render() {
        // let fontSize = this.fontSize();
        // console.log("size", fontSize)
        console.log("data in card", this.props.data)
        console.log("FUCKKKK");
        const o_sys = window.navigator.platform
        const divStyle = {
            fontSize: this.fontSize(),
        };

        return (
            <div >
                {this.props.data ? (

                <div className={styles.card}>
                    <div className={`${styles.section} ${styles.ablumcover}`}>
                        <img
                            src={this.props.data.album_image.url}
                            alt={this.props.data.track_name}
                            className={styles.ablumcover}
                        />
                    </div>
                    <div className={`${styles.section} ${styles.info}`}>
                        {/* https://stackoverflow.com/questions/52166900/fit-text-within-a-container-by-reducing-font-size-and-truncating-text */}
                        {/* <div className={styles.titlesection}> */}
                            <h1 className={styles.title} style={divStyle}> {this.props.data.track_name}</h1>
                            <p className={styles.artist}> {this.props.data.track_artist}</p>
                            <p className={styles.album}> {this.props.data.album_name}</p>
                        {/* </div> */}

                        
                        {/* <p className={styles.explicit}>{this.props.data.is_explicit ? 'Explicit' : 'Nonexplicit'}</p> */}
                        {/* <p className={styles.attempt}>Number of attempts to get this song: {this.props.data.attempts}</p> */}
                    </div>
                    {/* <div className={`${styles.section} ${styles.spotify}`}>
                        <a href='https://spotify-randomizer-backend.herokuapp.com/login'>Listen On Spotify</a>
                    </div> */}
                </div>
                ) : <div></div> }
            </div>
        )
    }
};

export default SongCard;