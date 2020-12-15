import Head from 'next/head'
import SongCard from '../components/songCard'
import MainButton from '../components/mainButton'
import React from 'react';
import liststyles from '../styles/List.module.scss'
import {SpotifyContext, withSpotify} from '../context'
// import styles from '../styles/Home.module.css'

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
        axios.get(`https://randify-backend.herokuapp.com/token`, {
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
    let temparr = this.state.songList
    temparr.push(data)
    this.setState({
      songList: temparr,
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
        <p>List of Songs</p>
        {this.state.songList.map((dataObj) => {
          return (
            <li className={liststyles.cards} key={dataObj.track_id}>
              <p>Song: {dataObj.track_name} Artist: {dataObj.track_artist} </p>
              <a href={openSpot + dataObj.track_id} target="_blank"> Open Song </a>
              <a>Add to Playlist</a>
            </li>
          )}
        )}
      </ul>
    );
    return htmlList;
  }
  
  render() {
    const {isLoading} = this.state
    return (
      <>
        <Head>
          <meta charSet="utf-8" />
          <title>Randify: The random Spotify song Genetor</title>
          <meta name="description" content="An example of a meta description." />
          <link rel="preconnect" href="https://fonts.gstatic.com"></link>
          <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap" rel="stylesheet"></link>
        </Head>
        {/* Consumer start here? */}
        <SpotifyContext.Consumer>
          {spotifyUser => spotifyUser ? <p>User</p> : <p>No User</p>}
          {/* move login into a condtional */}
          {/* <User data={spotifyuser} /> */}
          </SpotifyContext.Consumer>
            <header>
              <h1>Randify</h1>
              <a href='https://randify-backend.herokuapp.com/login'>Login</a>
            </header>
            {/* <NoteConsumer>
              {({ state }) => (
                <p>
                hi I'm {state.spotifyUser}
                </p>
                )}
              </NoteConsumer> */}



            <MainButton updateList={this.updateList}/>
            <div className="section2">
                    {isLoading ? <p>Loading...</p> : <this.List />}
            </div>
        
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
