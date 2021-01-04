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

        // for knowing what OS its on
        // const o_sys = window.navigator.platform

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
                        
                    </div>
                    
                </div>
                ) : <div></div> }
            </div>
        )
    }
};

export default SongCard;