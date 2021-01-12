import Head from 'next/head'
import MainButton from '../components/mainButton'
import React from 'react';
import liststyles from '../styles/List.module.scss'
import {SpotifyContext, withSpotify} from '../context'
import styles from '../styles/Home.module.scss'
// import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// import Button from '@material-ui/core/Button';
import CardNav from '../components/listNav'
import Nav from '../components/Nav';

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
    // const { songList } = temp_arr;
    // var list = localStorage.getItem('songList')
  }

  clearList = () => {

  }

  List = ({spotifyUser}) => {
    const openSpot = 'https://open.spotify.com/track/'
    // transfer the li into a card???
    let htmlList = (
      <ul className={liststyles.list}>
        {this.state.songList.map((dataObj, index) => {
          // need to make a check if the SpotifyUser exists!!!
          const len = this.state.songList.length;
          console.log("len", len);
          console.log((index - len) + 1)
          console.log("thing", this.state.songList.indexOf(dataObj))
          let i = (index + len);
          // separte function????
          // taking dataObj, spotifyUser if any????
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
                  {index + 1}
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
    return (
      <>
        <Head>
          <html lang='en-us' />
          <meta charSet="utf-8" />
          <title>Randofy</title>
          <meta name="description" content="Generate a completely random Spotify song with a click!" />
          <link rel="preconnect" href="https://fonts.gstatic.com"></link>
          <link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Poppins&family=Righteous&family=Rubik&family=JetBrains+Mono&display=swap" rel="stylesheet"></link>
        </Head>
        
        <SpotifyContext.Consumer>
          {/* User / No User */}
          {spotifyUser => spotifyUser && spotifyUser.spotifyUser ? 
          (<div>
            {/* <Header spotifyUser={spotifyUser} />*/}
            <header className={styles.header}>
              <h1 className={styles.title}>Randofy</h1>
              <Nav spotifyUser={spotifyUser} />
            </header>
            <MainButton updateList={this.updateList}/>
            <div className={styles.sectionmain}>
              { songList.length < 1 ? 
              <p></p> 
              : 
              <this.List spotifyUser={spotifyUser} />}
            </div>
          </div>) 
          : (<div>
              {/* <Header spotifyUser={null} />*/}
              <header className={styles.header}>
                <h1 className={styles.title}>Randofy</h1>
                <Nav spotifyUser={null} />
              </header>
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
      </>
    )
  }
}

export default withSpotify(Home);
