import axios from 'axios';
import React from 'react'
import SongCard from '../components/songCard'
import styles from '../styles/MainButton.module.scss'
import Color from 'color-thief-react'

// onClick fetch data from backend and then use loader

class MainButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: "",
            isLoaded: false,
            isLoading: false,
            // song: null,
            songData: null,
            type: this.props.type ? this.props.type : "track",
            imgImg: null,
        };
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick = () => {
        // Returns so that multiple presses don't happen
        if (this.state.isLoading) return;
        this.setState({isLoading: true});
        axios.get(`https://randofy-backend.herokuapp.com/random`)
        .then(response => {
            if (this.props.updateList){
                this.props.updateList(response.data);
            }
            this.setState({
                isLoaded: true,
                isLoading: false,
                songData: response.data,
                imgImg: response.data.album_image.url
            });
        })
        .catch(error => {
            this.setState({
                isLoaded: true,
                isLoading: false,
                error: error,
            });
        })
    }

    buttonText = () => {
        // Dynamic Text for button
        if (this.state.isLoading == true) {
            return 'Loading';
        }
        else if (this.state.isLoaded == true && this.state.isLoading == false) {
            return 'Get another random song';
        } 
        else{
            return 'Get a random song';
        }
    }

    render() {
        // if type is track or album change the button text based on that
        let {songData, isLoaded, isLoading} = this.state;
        let img = this.state.imgImg
        const text = this.buttonText();
        let disabled = isLoading;
        return (
            <div className="section">
                {isLoaded ? 
                    <div className={styles.return}> 
                        <Color src={img} crossOrigin="anonymous" format="hex">
                            {({ data}) => {
                            let color = data
                            return (
                                <div className={styles.cardsection} style={{backgroundColor: `${color}`}}>
                                        <SongCard data={this.state.songData} /> 
                                    </div>
                                );
                            }}
                        </Color>
                        <div className={styles.buttonsection}>
                            <button className={styles.btn + ' ' + styles.trackbutton} onClick={this.handleClick} disabled={disabled}>{this.buttonText()}</button>
                        </div>
                    </div>
                : 
                    <div className={styles.return}>
                        <div className={styles.sectioncenter}>
                            <button className={styles.btn + ' ' + styles.newsongbutton} onClick={this.handleClick} disabled={disabled}>{text}</button>
                        </div>
                    </div>
                }
            </div>
        )
    }

}


export default MainButton;