import React from 'react'
import Link from 'next/link'

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
        return (
            <div className='card'>
                <h1>Card</h1>
                {/* <p>The data from parent is:{this.props.data}</p> */}
                {/* <p>Track: {this.props.data.track_name}</p> */}
                {/* <p>Artist: {this.props.track_artist}</p> */}
                {/* <p>Album: {this.props.album_name}</p> */}
                {/* <p>Explicit: {this.props.data.is_explicit}</p> */}
                {/* <p>Attempts: {this.props.attempts}</p> */}
                {/* <img 
                    src={this.props.album_image.url}
                    alt="new"
                /> */}
                <Link href='spotify.com'>Listen On Spotify</Link>
            </div>
        )
    }
};

export default SongCard;