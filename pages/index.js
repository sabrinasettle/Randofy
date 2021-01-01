import Head from 'next/head'
import MainButton from '../components/mainButton'
import React from 'react';
import liststyles from '../styles/List.module.scss'
import {SpotifyContext, withSpotify} from '../context'
import styles from '../styles/Home.module.scss'
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import RadioIcon from '@material-ui/icons/Radio';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import Button from '@material-ui/core/Button';


import { NoteConsumer } from '../context/spotifyUser';
import axios from 'axios';

// export default function Home({data}) {
class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      songList: [],
      isLoading: true,
      code: null,
      // test: "butts",
    }
  }

  componentDidMount(){
    // gets params of code from the redirect on login
    const params = new URLSearchParams(window.location.search.substring(1))
    const code = params.get("code");
    console.log("code from login is", code);
    // original testing console.log
    // console.log("props location", this.props.location.search)
    if (code) {
      this.setState({
        code: code,
      }, () => {
        // callback gets from the backend the user data
        axios.get(`https://randofy-backend.herokuapp.com/token`, {
          code
        })
        .then(response => {
          // console.log(response);
          // gets the user https://api.spotify.com/v1/me
          // https://developer.spotify.com/documentation/web-api/reference/users-profile/get-current-users-profile/
          // needs the access_token and token_type in the request
          console.log("token", response.data.access_token)
          console.log("expries_in", response.data.expires_in)
          console.log("type", response.data.token_type)
        })
        .catch(error => {
          console.log(error);
        })

        console.log("index state code is", this.state.code);
        console.log(code)
      });
      // send to backend route to get the user data
    }
  }

  updateList = (data) => {
    this.setState({
      isLoading: true
    })
    let temp_arr = this.state.songList
    temp_arr.push(data)
    this.setState({
      songList: temp_arr,
      isLoading: false,
    });
    const { songList } = this.state;
    localStorage.setItem('songList', songList);
    var list = localStorage.getItem('songList')
    console.log("localStorage", list);
  }

  List = () => {
    const openSpot = 'https://open.spotify.com/track/'
    // transfer the li into a card???
    let htmlList = (
      <ul className={liststyles.list}>
        {this.state.songList.map((dataObj, index) => {
          return (
            <li className={liststyles.cards} key={dataObj.track_id}>
              <div className={liststyles.fbcard}>

                <div className={liststyles.index}>
                  {index + 1}
                </div>
                <div className={liststyles.span}>
                <p>Song: {dataObj.track_name} </p>
                <p>Artist: {dataObj.track_artist} </p>
                <p>{dataObj.is_explicit ? 'Explicit' : 'Nonexplicit'}</p>
                <p>Number of attempts to get this song: {dataObj.attempts}</p>
                {/* <ul>
                  <li> */}
                    <a href={openSpot + dataObj.track_id} target="_blank"><i><PlayCircleOutlineIcon /></i>Open Song </a>

                  {/* </li>
                  <li> */}
                    <a><i><ControlPointIcon/></i>Add to Playlist</a>

                  {/* </li>
                  
                </ul> */}
                </div>
              </div>
            </li>
          )}
        )}
      </ul>
    );
    return htmlList;
  }

  Loading = () => {

  }
  
  render() {
    const {isLoading, songList} = this.state
    return (
      <>
        <Head>
          <html lang='en-us' />
          <meta charSet="utf-8" />
          <title>Randofy: The random Spotify song Generator</title>
          <meta name="description" content="Generate a completely random Spotify song with a click!" />
          <link rel="preconnect" href="https://fonts.gstatic.com"></link>
          <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap" rel="stylesheet"></link>
          {/* <link href="https://fonts.googleapis.com/css2?family=Bungee+Outline&display=swap" rel="stylesheet"></link> */}
          {/* <link href="https://fonts.googleapis.com/css2?family=Russo+One&display=swap" rel="stylesheet"></link> */}
          {/* I like the one below */}
          {/* <link href="https://fonts.googleapis.com/css2?family=Righteous&display=swap" rel="stylesheet"></link> */}
          <link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Poppins&family=Righteous&family=Rubik&display=swap" rel="stylesheet"></link>
        </Head>
        {/* Consumer start here? */}
        <SpotifyContext.Consumer>
          {/* User / No User testing */}
          {spotifyUser => spotifyUser ? <p></p> : <p></p>}
          {/* move login into a condtional */}
          {/* <User data={spotifyuser} /> */}
        </SpotifyContext.Consumer>
            <header className={styles.header}>
              <h1 className={styles.title}>Randofy</h1>
              <nav className={styles.mainnav}>
                <a className={styles.link} href='https://randofy-backend.herokuapp.com/login'><i><ExitToAppIcon/></i>Login</a>
                <a className={styles.link}>About</a>
              </nav>
            </header>
            {/* <NoteConsumer>
              {({ state }) => (
                <p>
                hi I'm {state.spotifyUser}
                </p>
                )}
              </NoteConsumer> */}



            <MainButton updateList={this.updateList}/>
            <div className={styles.sectionmain}>
                    { songList.length < 1 ? 
                    <p></p> 
                    : 
                    <this.List />}
            </div>
            {/* <footer> */}
              {/* About */}
            {/* </footer> */}
      </>
    )
  }
}

// export default Home;

export default withSpotify(Home);





// Used to test backend orignally without components 
// export async function getServerSideProps(context) {

//   const res = await fetch(`https://spotify-randomizer-backend.herokuapp.com/random`)
//   const data = await res.json()
  
//   if (!data) {
//     return {
//       notFound: true,
//     }
//   }
  
//   return {
//     props: { data } // will be passed to the page component as props
//   }
// }
