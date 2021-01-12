import React from 'react';
import Nav from './Nav'
import styles from '../styles/Header.module.scss'

class Header extends React.Component {
    render(){
        return(
            <header className={styles.header}>
                <h1 className={styles.title}>Randofy</h1>
                <Nav spotifyUser={this.props.spotifyUser} />
            </header>
        )
    }
}

export default Header;