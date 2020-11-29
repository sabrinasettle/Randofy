import Head from 'next/head'
// Sam says to do the thing
// import Button from '../components/Button'
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
  getAccessToken();
  return (
    <div className={styles.container}>
      <Head>
        Header
      </Head>
      <div>Im a real Button</div>
    </div>
  )
}

// This returns the access token for the Client Credentials Flow of the Spotify API (here: https://developer.spotify.com/documentation/general/guides/authorization-guide/#client-credentials-flow)
// Notes: Change this so it runs the request less and doesnt cross streams on access_token which gets set in the APIWrapper code
export async function getAccessToken() {

  var id = process.env.SPOT_ID;
  var secret = process.env.SPOT_SECRET;
  var str = id.concat(":", secret);
  // const b64 = Base64.btoa(str);

  // Create the api object with the credentials
  var spotifyApi = new SpotifyWebApi({
    clientId: id,
    clientSecret: secret
  });

  // if webpacker cant see child function then ignore, otherwise run getGrant, esstienally a cheat 
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

  // previous code that never worked 
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
}

