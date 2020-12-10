import Head from 'next/head'
import SongCard from '../components/songCard'
import MainButton from '../components/mainButton'
import React from 'react';
import liststyles from '../styles/List.module.scss'
// import styles from '../styles/Home.module.css'

import { NoteConsumer } from '../components/spotifyUser';

// export default function Home({data}) {
class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      songList: [],
      isLoading: true,
      // test: "butts",
    }
  }

  componentDidMount(){
    const params = new URLSearchParams(window.location.search.substring(1))
    console.log("params", params.get("user"));
    // console.log("props location", this.props.location.search)
  }

  updateList = (data) => {
    this.setState({isLoading: true})
    let temparr = this.state.songList
    temparr.push(data)
    this.setState({
      songList: temparr,
      isLoading: false,
    })
  }

  List = () => {
    let htmlList = (
      <ul>
        <p>List of Songs</p>
        {this.state.songList.map((dataObj) => {
          return (
            <li>
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
            <NoteConsumer>
              {({ state }) => (
                <p>
                  hi I'm {state.spotifyUser}
                  {/* <button onClick={growAYearOlder}>Grow</button> */}
                </p>
              )}
            </NoteConsumer>



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
