import Head from 'next/head'
import SongCard from '../components/songCard'
import MainButton from '../components/mainButton'
import React from 'react';
import liststyles from '../styles/List.module.scss'
// import styles from '../styles/Home.module.css'

import { NoteConsumer } from '../components/spotifyUser';
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
    const params = new URLSearchParams(window.location.search.substring(1))
    const code = params.get("code");
    console.log("code from login is", code);
    // original testing console.log
    // console.log("props location", this.props.location.search)
    if (code) {
      this.setState({
        code: code,
      }, () => {
        // callback
        axios.get(`https://randify-backend.herokuapp.com/token`, {
          code
        })
        .then(response => {
          console.log(response);
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
    let htmlList = (
      <ul>
        <p>List of Songs</p>
        {this.state.songList.map((dataObj) => {
          return (
            <li key={dataObj.track_id}>
              <p>{dataObj.track_name} {dataObj.track_artist} </p>
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
        </Head>
        
            <header>
              <h1>Randify</h1>
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

export default Home;

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
