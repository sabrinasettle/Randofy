import React from 'react'
import Link from 'next/link'

class SongCard extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            isLoaded: false
        };
    }

    render() {
        return (
            <div className='card'>
                <h1>Card</h1>
                <p>Track: {this.props.track_name}</p>
                <p>Artist: {this.props.track_artist}</p>
                <p>Album: {this.props.album_name}</p>
                <p>Explicit: {this.props.is_explicit}</p>
                <p>Attempts: {this.props.attempts}</p>
                <img 
                    src={this.props.album_image.url}
                    alt="new"
                />
                <Link href='spotify.com'>Listen On Spotify</Link>
            </div>
        )
    }
};

export default SongCard;