import React from 'react';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import RadioIcon from '@material-ui/icons/Radio';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import Button from '@material-ui/core/Button';
import { ThreeSixty } from '@material-ui/icons';

const openSpot = 'https://open.spotify.com/track/'
class CardNav extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            user: false,
            song: false,
        };
        // this.handleClick = this.handleClick.bind(this);
    }

    Add = () => {
        return <button onClick={() => {console.log("remove")}}><i><ControlPointIcon/></i>Add to Playlist</button> 
    }

    Remove = () => {
        return <button onclick={() => {console.log("remove")}}><i><ControlPointIcon/></i>Remove from Playlist</button>
    }

    PlaylistButton = () => {
        if (this.props.data.song){
            <this.Remove />
        }
        else{
            <this.Add />
        }
    }

    render() {
        // if the user is true then show all the links if not then yeah
        return (
            <div>
                {/* this link should be in both versions */}
                <a href={openSpot + this.props.data.songId} target="_blank"><i><PlayCircleOutlineIcon /></i>Open Song </a>
                {this.props.data.user ? <this.PlaylistButton /> : <p> Please Login</p> }
                {/* <this.PlaylistButton /> */}
            </div>
        )
    }
};

export default CardNav;