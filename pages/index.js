import Head from 'next/head'
import Button from '../components/Button'
import styles from '../styles/Home.module.css'
import { Base64 } from 'js-base64';
import axios from 'axios';

// console.log(process.env.SPOT_ID)

export default function Home() {
  let access_token; 
  if (access_token == null)
  {
     console.log("no access token")
  }
  accessToken();
  // let api = getStaticProps();
  // console.log(api);
  
  // ok here grab that and then apply that to the call of the post
  // curl -X "POST" -H "Authorization: Basic ZjM4ZjAw...WY0MzE=" -d grant_type=client_credentials https://accounts.spotify.com/api/token
  
  // curl -X "POST" -H "Authorization: Basic ZTZhNjNjYWU0NTlmNDY4N2I0YTA1NmI5ODRiNTUyMGU6ZjFjNDU3ODUxYzFiNGFlYWJiNTBhZDdhZDkyNmM4Yzg=" -d grant_type=client_credentials https://accounts.spotify.com/api/token
  // filter the response for both type and access code if the status is successful (200)
  //{
  //  "access_token": "NgCXRKc...MzYjw",
  //  "token_type": "bearer",
  //  "expires_in": 3600,
  // }

  // curl -H "Authorization: Bearer NgCXRKc...MzYjw" https://api.spotify.com/v1/tracks/2TpxZ7JUBn3uw46aR7qd6V

  // in future also check the expired part of the token and recreate
  return (
    <div className={styles.container}>
      <Head>
        Header
      </Head>
      {/* <div> {b64} </div> */}
      <Button />
    </div>
  )
}

export async function accessToken() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  // from main component
  var id = process.env.SPOT_ID;
  var secret = process.env.SPOT_SECRET;
  var str = id.concat(":", secret);
  const b64 = Base64.btoa(str);

  // const res = await fetch('https://accounts.spotify.com/api/token', {
  //   method: "POST",
  //   headers: '',   
  // })

  // curl -X "POST" -H "Authorization: Basic ZjM4ZjAw...WY0MzE=" -d grant_type=client_credentials https://accounts.spotify.com/api/token
  // fro axios POST docs

  // try {
  //   const {data:response} = await axios.get(url) //use data destructuring to get data from the promise object
  //   return response
  // }

  // catch (error) {
  //   console.log(error);
  // }

  // try {
  //   const {data:response} = await axios.post('https://accounts.spotify.com/api/token',`grant_type=client_credentials`, {
  //     Authorization: `Basic ${b64}`,
  // })
  // }
  // catch(err){
  //   console.error(err);
  // };


  // return await axios.post('https://accounts.spotify.com/api/token',`grant_type=client_credentials`, {
  //   Authorization: `Basic ${b64}`,
  // }).then((result) => {
  //   if (result)
  //     return result.data;
  //   else
  //     return error
  // }).catch(error => console.error(error));

  axios.post('https://accounts.spotify.com/api/token', {
    headers: {
      Authorization: `Basic ${b64}`,
      grant_type: "client_credentials",
      'Content-Type': 'application/x-www-form-urlencoded', 
    }
  }).then(function(response) {
    console.log(response);
    return response;
  }).catch(function (error){
    console.log(error);
    return error;
  })

  // return fetch('https://accounts.spotify.com/api/token', {
  //   Authorization: `Basic ${b64}`,
  //   grant_type: 'client_credentials'
  // }).then(res => {
  //   console.log(res)
  // }).then(data => console.log("data", data))
  // .catch(err => console.log("error", err))

  // axios.post('/user', {
  //   firstName: 'Fred',
  //   lastName: 'Flintstone'
  // })
  // .then(function (response) {
  //   console.log(response);
  // })
  // .catch(function (error) {
  //   console.log(error);
  // });



  // needs to return this

  // {
  //   "access_token": "NgCXRKc...MzYjw",
  //   "token_type": "bearer",
  //   "expires_in": 3600,
  // }


  // const posts = await res.json()

  // By returning { props: posts }, the Blog component
  // will receive `posts` as a prop at build time
  // return {
  //   props: {
  //     b64,
  //   //   posts,
  //   },
  // }

}

