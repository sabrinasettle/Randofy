import React from 'react';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import RadioIcon from '@material-ui/icons/Radio';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { ThreeSixty } from '@material-ui/icons';
import styles from '../styles/Home.module.scss'



const openSpot = 'https://open.spotify.com/track/'
class CardNav extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            user: false,
            song: false,
        };
    }


    PlaylistButton = () => {
        if (this.props.data.song){
            return <Button 
                startIcon={<ControlPointIcon />} 
                onClick={() => this.props.data.spotifyUser.removeFromPlaylist(this.props.data.songId)}
                >
                    Remove from Playlist
                </Button>
        }
        else{
            return <Button 
                startIcon={<ControlPointIcon />} 
                onClick={() => this.props.data.spotifyUser.addToPlaylist(this.props.data.songId)}
                >
                    Add to Playlist
                </Button> 
        }
    }


    render() {
        // if the user is true then show all the links if not then yeah
        // console.log(this.props.data.spotifyUser)
        const href = openSpot + this.props.data.songId
        return (
            <div>
                {/* this link should be in both versions */}
                <Link
                    href={href}
                    target="_blank"
                    rel="noopener"
                >
                    <Button
                        startIcon={<PlayCircleOutlineIcon />}
                    >
                        Open Song in Spotify
                    </Button>
                </Link>
                {this.props.data.user ? <this.PlaylistButton /> : <p></p> }
            </div>
        )
    }
};

export default CardNav;