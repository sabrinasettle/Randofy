import Head from 'next/head'
import Button from '../components/Button'
import styles from '../styles/Home.module.css'
import { Base64 } from 'js-base64';
import axios from 'axios';
import SpotifyWebApi from 'spotify-web-api-node';
import querystring from 'query-string';
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
  // var id = process.env.SPOT_ID;
  // var secret = process.env.SPOT_SECRET;
  // var str = id.concat(":", secret);
  // const b64 = Base64.btoa(str);

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

  // https://stackoverflow.com/questions/55557557/axios-post-results-in-bad-request-grant-typeclient-credentials
  
  // ,{
    //   // note the use of querystring
    //   querystring.stringify({'grant_type':'client_credentials'}),{
      //   headers: {
        //     'Content-Type':'application/x-www-form-urlencoded',     
        //     'Authorization': 'Basic xxxx'   
        //   }
        
  const stringified = querystring.stringify({'grant_type':'client_credentials'});
  console.log(stringified)

  var id = process.env.SPOT_ID;
  var secret = process.env.SPOT_SECRET;
  var str = id.concat(":", secret);
  const b64 = Base64.btoa(str);

  var clientId = 'someClientId',
  clientSecret = 'someClientSecret';

// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
  clientId: id,
  clientSecret: secret
});


// Retrieve an access token.
// if webpacker cant see child function then ignore, otherwise run getGrant
// esstienally a cheat 

// Put it as part of an HOC (Higher Order Component)
if (spotifyApi && spotifyApi.clientCredentialsGrant) {
  spotifyApi.clientCredentialsGrant().then(
   function(data) {
     console.log('The access token expires in ' + data.body['expires_in']);
     console.log('The access token is ' + data.body['access_token']);
     // Save the access token so that it's used in future calls
     spotifyApi.setAccessToken(data.body['access_token']);
   },
   function(err) {
     console.log('Something went wrong when retrieving an access token', err);
   }
 ).catch(error => console.log(error));
}

  // axios.post('https://accounts.spotify.com/api/token', 
  //   // queryString.stringify({'grant_type':'client_credentials'}),{
  //     // stringified,
  //     `grant_type=client_credentials`, 
  //     {
  //       Authorization: 'Basic ' + str.toString('base64'),
  //       'Content-Type': 'application/x-www-form-urlencoded',
      
  //     // body: querystring.stringify({'grant_type':'client_credentials'}),
  //     // transformRequest: getQueryString,
  //   // }
  // }).then(function(response) {
  //   console.log(response);
  //   return response;
  // }).catch(function (error){
  //   console.log(error);
  //   return error;
  // })

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

