import React, { Component } from 'react';
import SpotifyContext from './context'
import SpotifyWebApi from 'spotify-web-api-js';

import axios from 'axios';
// first we will make a new context
const withSpotify = Component => {
  class WithSpotify extends Component {
    constructor(props) {
      super(props);
      this.State = {
        spotifyUser: null,
      };
      this.spotify = new SpotifyWebApi()
    };

    // createSession = () => {
      
    // };
    
    destroySession = () => {
      // clear the localStorage 
      // and the SpotifyUser object gets emptied
      // this is done by updating the state
      // will this work?? I mean does the user even get to login in everytime or is a straight apporal of the app in the first place?
      localStorage.removeItem('spotifyUser');
      localStorage.removeItem('access_token');
      this.setState({ spotifyUser: null })
    };

    setAccessToken = (access_token) => this.spotify.setAccessToken(access_token);
    getAccessToken = () => this.spotify.getAccessToken();

    getMe = async () => await this.spotify.getMe().then(res => {
      console.log(res)
      this.setState({spotifyUser: res});
      localStorage.setItem("spotifyUser", JSON.stringify(res));
    })

    tokenCall = async (code) => {
      // gets the user https://api.spotify.com/v1/me
      // https://developer.spotify.com/documentation/web-api/reference/users-profile/get-current-users-profile/
      // needs the access_token and token_type in the request

        return await axios.get(`https://randofy-backend.herokuapp.com/token`, {
          params: {code}
        })
        .then(async response => {
          console.log("token", response.data.access_token)
          console.log("expries_in", response.data.expires_in)
          console.log("type", response.data.token_type)
          // response.data
          localStorage.setItem("access_token", response.data.access_token);
          
          this.setAccessToken(response.data.access_token);
          console.log(response);
          this.getMe();
          // axios.get("https://api.spotify.com/v1/me", {
          //   headers: {
          //     'Authorization': `Bearer ${response.data.access_token}`
          //   }
          //   })
          // .then(res => {
          //   console.log("TELL ME", res)
          //   this.setState({
          //     spotifyUser: ReadableStream.data
          //   },
          //   () => {
          //     console.log(this.state.spotifyUser);
          //     localStorage.setItem('spotifyUser', res.data);
          //   });
          //   console.log('res', res);
          // })
          // .catch(err => console.error(err))
        })
        .catch(error => {
          console.log(error);
        })
    };

    componentDidMount(){
      if (this.getAccessToken() === null){
        const access_token = localStorage.getItem("access_token");
        if (access_token){
          this.setAccessToken(access_token);
        }
      }

      let spotuser = localStorage.getItem("spotifyUser")
      if (spotuser){
        console.log(typeof spotuser)
        if (typeof spotuser === "string"){
          spotuser = JSON.parse(spotuser);
        }
        console.log("has storage", spotuser)
        this.setState({
          spotifyUser: spotuser,
        }, () => location.replace(window.location.host))
        // we have the user or 'me'
      }
      else {
        console.log("does no have storage")
          const params = new URLSearchParams(window.location.search.substring(1))
          let code = params.get("code");
          console.log("from SPUSER", code)
          localStorage.setItem('code', code);
          // get the spotifyUser with the code
          if (code){
            this.tokenCall(code);
          }

        
      }

    };

    componentWillUnmount() {
      // remove listener - for protection from leaks

    };

    render(){
      return(
        <SpotifyContext.Provider value={{spotifyUser: this.state.spotifyUser, destroySesh: this.destroySession}}> 
          <Component {...this.props}/>
        </SpotifyContext.Provider>
      );
    };
  }

  return WithSpotify;
}

export default withSpotify;


// first attempt
// Then create a provider Component
// class NoteProvider extends Component {
//   state = {
//     // spotifyUser: localStorage ? JSON.parse(localStorage.getItem('spotifyUser')) : null,
//   };
//   render() {
//     return (
//       <NoteContext.Provider
//         value={{
//           state: this.state,
//         }}
//       >
//         {this.props.children}
//       </NoteContext.Provider>
//     );
//   }
// }

// then make a consumer which will surface it
// const NoteConsumer = NoteContext.Consumer;

// export default NoteProvider;
// export { NoteConsumer };