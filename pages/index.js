import Head from 'next/head'
import SongCard from '../components/songCard'
import MainButton from '../components/mainButton'
import React from 'react';
// import styles from '../styles/Home.module.css'

// export default function Home({data}) {
class Home extends React.Component {
  // console.log("in index", data);
  render() {
    return (
      <div>
        <Head></Head>
        <body>
    
          {/* <div className="page"> */}
            <header>
              <h1>Randify</h1>
            </header>
            <MainButton />
            <div className="section2">
    
            </div>
          {/* </div> */}
        </body>
      </div>
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