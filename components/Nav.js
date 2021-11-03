import React from 'react';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { ThreeSixty } from '@material-ui/icons';
import styles from '../styles/Nav.module.scss'
import NavLink from './Button/Button';

// {spotifyUser.spotifyUser.display_name} Logout
class Nav extends React.Component {
    render() {
        console.log(!this.props.spotifyUser)
        return(
            <nav className={styles.mainnav}>
                {this.props.spotifyUser ? 
                    <Button 
                    onClick={() => this.props.spotifyUser.destroySesh()}
                    >
                        {this.props.spotifyUser.spotifyUser.display_name} Logout
                    </Button>
                : <Link href='https://randofy-backend.herokuapp.com/login/'>
                        <Button >
                            Login
                        </Button>
                    </Link>
                }
                <NavLink location={'/about'} text={'About'} />
            </nav>
        )
    }

}

export default Nav;