import React from 'react';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import RadioIcon from '@mui/icons-material/Radio';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import styles from '../styles/Home.module.scss';

const openSpot = 'https://open.spotify.com/track/';
class CardNav extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: false,
			song: false,
		};
	}

	PlaylistButton = () => {
		if (this.props.data.song) {
			return (
				<Button
					startIcon={<ControlPointIcon />}
					onClick={() =>
						this.props.data.spotifyUser.removeFromPlaylist(
							this.props.data.songId,
						)
					}>
					Remove from Playlist
				</Button>
			);
		} else {
			return (
				<Button
					startIcon={<ControlPointIcon />}
					onClick={() =>
						this.props.data.spotifyUser.addToPlaylist(this.props.data.songId)
					}>
					Add to Playlist
				</Button>
			);
		}
	};

	render() {
		// if the user is true then show all the links if not then yeah
		// console.log(this.props.data.spotifyUser)
		const href = openSpot + this.props.data.songId;
		return (
			<div>
				{/* this link should be in both versions */}
				<Link href={href} target="_blank" rel="noopener">
					<Button startIcon={<PlayCircleOutlineIcon />}>
						Open Song in Spotify
					</Button>
				</Link>
				{this.props.data.user ? <this.PlaylistButton /> : <p></p>}
			</div>
		);
	}
}

export default CardNav;
