import Head from 'next/head'
import SongCard from '../components/songCard'
import MainButton from '../components/mainButton'
// import styles from '../styles/Home.module.css'

export default function Home({data}) {
  // console.log("in index", data);
  return (
    <div>
      <p> Testing </p>
      <MainButton></MainButton>
      {/* <SongCard {...data} /> */}
    </div>
  )
}

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