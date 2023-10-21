import React from 'react';
import Nav from './Nav';
import Link from '@mui/material/Link';
import styles from '../styles/Header.module.scss';

class Header extends React.Component {
	render() {
		// console.log(this.props.spotifyUser, "header")
		return (
			<header className={styles.header}>
				<h1 className={styles.title}>
					<Link href="/">Randofy</Link>
				</h1>
				<Nav spotifyUser={this.props.spotifyUser} />
			</header>
		);
	}
}

export default Header;
