import React from 'react';
// import Button from '@mui/material/Button';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { ThreeSixty } from '@material-ui/icons';
import styles from '../styles/Nav.module.scss'
import NavLink from './Button/Button';
import { withRouter } from 'next/router';

class Nav extends React.Component {
    render() {
        const page = this.props.router.pathname;
        return(
            <nav className={styles.mainnav} role="navigation" aria-label="Main">
                <ul className={styles.mainul}>
                { page === '/' ? (
                    <>
                        <li className={styles.link}>
                            <NavLink location={'/about'} text={'About'} />
                        </li>
                        {this.props.spotifyUser ? 
                            <li className={styles.link}>
                                <Button 
                                variant="outlined" style={{borderColor:"white"}}
                                onClick={() => this.props.spotifyUser.destroySesh()}
                                >
                                    Logout
                                </Button>
                            </li>
                        : 
                            <li className={styles.link}>
                                <Link href='https://randofy-backend.herokuapp.com/login/' styles={{paddingLeft: "10px"}}>
                                    <Button variant="outlined" style={{borderColor:"white"}}>
                                        Login to Spotify
                                    </Button>
                                </Link>
                            </li>
                        }
                    </>
                ) : ( 
                    <li className={styles.link}>
                        <NavLink location={'/'} text={'Back to Home'} />
                    </li>
                ) }
                </ul>
            </nav>
        )
    }

}

export default withRouter(Nav);