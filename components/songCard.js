import React from 'react'

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
            <div className='card'>
                <img 
                    src={this.props.data.album_image.url}
                    alt="new"
                />
                <p>Track: {this.props.data.track_name}</p>
                <p>Artist: {this.props.data.track_artist}</p>
                <p>Album: {this.props.data.album_name}</p>
                <p>Explicit: {this.props.data.is_explicit ? 'true' : 'false'}</p>
                <p>Attempts: {this.props.data.attempts}</p>
                <a href='https://spotify-randomizer-backend.herokuapp.com/login'>Listen On Spotify</a>
            </div>
        )
    }
};

export default SongCard;