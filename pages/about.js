import React from 'react';
import Nav from '../components/Nav'
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import styles from '../styles/Home.module.scss'

// import styles from '../styles/Home.module.scss'

class About extends React.Component {
    render(){
        return(
            <>
                <header className={styles.header}>
                    <h1 className={styles.title}>Randofy</h1>
                    <nav className={styles.mainnav}>
                        <Link href='/'>Go Back</Link>
                    </nav>
                </header>
                <div>
                </div>
            </>
        )
    }
}

export default About;