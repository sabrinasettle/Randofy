import React, { Component } from 'react';
import SpotifyContext from './context'
import axios from 'axios';
// first we will make a new context
const withSpotify = Component => {
  class WithSpotify extends Component {
    constructor(props) {
      super(props);
      this.State = {
        spotifyUser: JSON.parse(localStorage.getItem('spotifyUser')),
        // me: JSON.parse(localStorage.getItem('me')),
      };
    };

    createSession = () => {
      
    };
    
    destroySession = () => {
      // clear the localStorage 
      // and the SpotifyUser object gets emptied
      // this is done by updating the state
      // will this work?? I mean does the user even get to login in everytime or is a straight apporal of the app in the first place?
      localStorage.setItem('spotifyUser', {});
      localStorage.setItem('code', null);
      this.setState({
        spotifyUser: {},
      })
    };

    tokenCall = async (code, callback) => {
      // gets the user https://api.spotify.com/v1/me
      // https://developer.spotify.com/documentation/web-api/reference/users-profile/get-current-users-profile/
      // needs the access_token and token_type in the request
        return await axios.get(`https://randofy-backend.herokuapp.com/token`, {
          code
        })
        .then(response => {
          console.log("token", response.data.access_token)
          console.log("expries_in", response.data.expires_in)
          console.log("type", response.data.token_type)
          callback(response.data);
        })
        .catch(error => {
          console.log(error);
        })
    };

    componentDidMount(){
      // Check to see if the user exists then if not and have access_token then get the user
      // let code = localStorage.getItem('code')
      const tokenCallback = (data) => {
        if (data.access_token){
          axios.get(`https://api.spotify.com/v1/me`, `Authorization: Bearer ${data.access_token}`)
          .then(response => {
            this.setState({
              spotifyUser: response.data
            },
            () => {
              console.log(this.state.spotifyUser);
              localStorage.setItem('spotifyUser', response.data);
            });
            console.log('res', response);
          })
          
        }
      };

      // create listener
      if (this.state.spotifyUser){
        // we have the user or 'me'
      }
      else {
        let code = localStorage.getItem('code');
        if(code){
          // get the spotifyUser
          // the call to /token using code as params
          this.tokenCall(code, tokenCallback);
          // make an auth request to Spotify

        }
        else {
          const params = new URLSearchParams(window.location.search.substring(1))
          code = params.get("code");
          console.log("from SPUSER", code)
          localStorage.setItem('code', code);
          // get the spotifyUser with the code
          this.tokenCall(code, tokenCallback)

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