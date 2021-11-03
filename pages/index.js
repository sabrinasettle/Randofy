import Head from 'next/head'
import MainButton from '../components/mainButton'
import React from 'react';
import liststyles from '../styles/List.module.scss'
import { SpotifyContext, withSpotify } from '../context'
import styles from '../styles/Home.module.scss'
import CardNav from '../components/listNav'
import Nav from '../components/Nav';
import Header from '../components/Header';
import Footer from '../components/Footer';

// import axios from 'axios';

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
    this.handleLeavePage = this.handleLeavePage.bind(this)
  }

  componentDidMount(){
    window.addEventListener("beforeunload", this.handleLeavePage);
    this.setState({isLoading: true});
    var list = JSON.parse(localStorage.getItem('songList'));
    if (list){
      this.setState({
        songList: list,
        isLoading: false,
      });
    }
  }

  componentWillUnmount() {
    // this.handleLeavePage()
    window.removeEventListener("beforeunload", this.handleLeavePage);
  }

  handleLeavePage = (e) => {
    localStorage.removeItem('songList');
    // const confirmationMessage = 'Some message';
    // e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
    // return confirmationMessage;              // Gecko, WebKit, Chrome <34
  }

  updateList = (data) => {
    this.setState({
      isLoading: true
    })
    let temp_arr = this.state.songList
    temp_arr.unshift(data)
    this.setState({
      songList: temp_arr,
      isLoading: false,
    });
    localStorage.setItem('songList', JSON.stringify(temp_arr));
  }

  List = ({spotifyUser}) => {
    const openSpot = 'https://open.spotify.com/track/'
    const len = this.state.songList.length;
    // transfer the li into a card???
    let htmlList = (
      <ul className={liststyles.list}>
        {/* Ha Sam, I got here first */}
        {len > 1 ? <h1 className={liststyles.count}>{len} songs generated</h1> : <h1 className={liststyles.count}>{len} song generated</h1>}
        {this.state.songList.map((dataObj, index) => {
          // need to make a check if the SpotifyUser exists!!!          
          let i = (len - index);

          let song;
          let user;
          let spotUser;
          const id = dataObj.track_id;
          if (spotifyUser){
            spotUser = spotifyUser;
          }
          else {
            spotUser = null;
          };
          if (spotifyUser && spotifyUser.songIds){
            !spotifyUser.songIds.includes(dataObj.track_id) ? song = false : song = true;
          };

          spotifyUser && spotifyUser.spotifyUser ? user = true : user = false;
          // if user then hand the functions to it

          const parentData = {user: user, song: song, songId: id, spotifyUser: spotUser};

          return (
            <li className={liststyles.cards} key={dataObj.track_id}>
              <div className={liststyles.fbcard}>
                <div className={liststyles.index}>
                  {i}
                </div>
                <div className={liststyles.span}>
                <p>Song: {dataObj.track_name} </p>
                <p>Artist: {dataObj.track_artist} </p>
                <p>{dataObj.is_explicit ? 'Explicit' : 'Nonexplicit'}</p>
                <p>Number of attempts to get this song: {dataObj.attempts}</p>
                {/* Need to send the user true/false value and the song true/false value */}
                <CardNav data={parentData} />                 
                </div>
              </div>
            </li>
          )}
        )}
      </ul>
    );
    return htmlList;
  }

  render() {
    const {isLoading, songList, spotifyUser} = this.state
    // console.log(spotifyUser, "index");
    return (
      <>
        <Head>
          <html lang='en-us' />
          <meta charSet="utf-8" />
          <title>Randofy - Spotify Track Randomizer </title>
          <meta name="description" content="Generate a completely random track from Spotify with a click!" />
          <link rel="preconnect" href="https://fonts.gstatic.com"></link>
          <link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Poppins&family=Righteous&family=Rubik&family=JetBrains+Mono&display=swap" rel="stylesheet"></link>
          <meta name="google-site-verification" content="U0dN7iMS6_CGDy31qxDUYcDzAWx3Bl5WyQbG8of7tKQ" />
        </Head>
        
        <SpotifyContext.Consumer>
          {/* User / No User */}
          {spotifyUser => spotifyUser && spotifyUser.spotifyUser ? 
          (<div>
            <Header spotifyUser={spotifyUser} />
            <MainButton updateList={this.updateList}/>
            <div className={styles.sectionmain}>
              { songList.length < 1 ? 
              <p></p> 
              : 
              <this.List spotifyUser={spotifyUser} />}
            </div>
          </div>) 
          : (<div>
              <Header spotifyUser={null} />
              <MainButton updateList={this.updateList}/>
              <div className={styles.sectionmain}>
                { songList.length < 1 ? 
                <p></p> 
                : 
                <this.List />}
              </div>
            </div>)
          }
        </SpotifyContext.Consumer>
        {/* <Footer /> */}
      </>
    )
  }
}

export default withSpotify(Home);
