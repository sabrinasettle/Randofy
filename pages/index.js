import Head from 'next/head'
import SongCard from '../components/songCard'
import MainButton from '../components/mainButton'
import React from 'react';
// import styles from '../styles/Home.module.css'

// export default function Home({data}) {
class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      songList: [],
      isLoading: true,
      test: "butts",
    }
  }

  updateButts = (string) => {
    this.setState({test: string});
    console.log(this.state.test)
  }

  updateSongList = (data) => {
    this.setState({isLoading: true})
    let temparr = this.state.songList
    temparr.push(data)
    this.setState({
      songList: temparr,
      isLoading: false,
    })
  }

  SongList = () => {
    let htmlList = `<ul>`;
    this.state.songList.map((dataObj) => {
      const track_name = dataObj.track_name;
      console.log(track_name);
      // li
      // p dataObj.title
      htmlList += `<li>;
      <p>${track_name}</p>;

      </li>`;
    })
    htmlList += "</ul>"
    return htmlList
  }
  
  render() {
    const {isLoading} = this.state
    return (
      <html>
        <Head></Head>
        <body>
    
          {/* <div className="page"> */}
            <header>
              <h1>Randify</h1>
            </header>
            <MainButton updateSongList={this.updateSongList}/>
            <div className="section2">
                    <p>List of Songs</p>
                    {isLoading ? <p>Loading...</p> : <this.SongList />}
            </div>
          {/* </div> */}
        </body>
      </html>
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