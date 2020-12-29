import React from 'react';
import SpotifyContext from './context'
// import SpotifyWebApi from 'spotify-web-api-js';

import axios from 'axios';
// first we will make a new context
const withSpotify = Component => {
  class WithSpotify extends Component {
    constructor(props) {
      super(props);
      this.State = {
        spotifyUser: null,
        auth: null,
        playlist: null
      };
      // this.spotify = new SpotifyWebApi()
    };

    createPlaylist = async () => {
      await this.checkTime();
      return await axios.post(`https://api.spotify.com/v1/users/${this.state.spotifyUser.id}/playlists`,
      {
        "name": "Randofy",
        "description": "Your Random collection of music found at: https://randofy.vercel.app/ ",
        "public": true
      },{
        headers: {
          'Authorization': `Bearer ${this.state.auth.access_token}`
        }
      })
      .then(response => {
        // response.data.id
        // response.data.tracks.items
        // response.data.href
        const playlist = {
          id: response.data.id,
          tracks: response.data.tracks.items,
          href: response.data.href
        }

        console.log(response)
        this.setState({ playlist });
        localStorage.setItem("playlist", JSON.stringify(playlist))
        // do something given 
      })
      .catch(error => {
        // couldnt create the playlist
        // token is always valid unless somewhere broked.
        console.error("inside createPlaylist: ", error)
      })
    };

    getPlaylist = async (playlist_id) => {
      await this.checkTime();
      return await axios.get(`https://api.spotify.com/v1/playlists/${playlist_id}`, {
        headers: {
          'Authorization': `Bearer ${this.state.auth.access_token}`
        }
      })
      .then(response => {
        const playlist = {
          id: response.data.id,
          tracks: response.data.tracks.items,
          href: response.data.href
        }
        this.setState({ playlist });
        localStorage.setItem("playlist", JSON.stringify(playlist))
      })
    }

    addToPlaylist = async (song_id) => {
      await this.checkTime();

    }

    checkPlaylist = async () => {
      await this.checkTime();

      // make this part moduler so that you can search thru all of a users playlists to see -
      // if the playlist exists, must be repeated until offset >= response.data.total - 50 
      return await axios.get("https://api.spotify.com/v1/me/playlists?limit=50", {
        headers: {
          'Authorization': `Bearer ${this.state.auth.access_token}`
        }
      })
      .then(response => {
        const items = response.data.items;
        const filtered = items.filter((item) => {
          if (item.name === "Randofy"){
            return item.id
          }
        })
        if (filtered.length){
          console.log(filtered[0])
          //get playlist and set state.
          this.getPlaylist(filtered[0].id)
        }
        else {
          // repeat unless offset is > response.data.total - 50 

          // then create playlist as last resort.
          this.createPlaylist()
        }
        //filter through playlists to find randofy, if no randofy playlist, create it.
        //set playlist object in state. pass as prop to class. 
      })
      //
    }

    
    destroySession = () => {
      // clear the localStorage 
      // and the SpotifyUser object gets emptied
      // this is done by updating the state
      // will this work?? I mean does the user even get to login in everytime or is a straight apporal of the app in the first place?
      localStorage.removeItem('spotifyUser');
      localStorage.removeItem('auth');
      localStorage.removeItem('playlist');
      this.setState({ spotifyUser: null, auth: null, playlist: null })
    };

    // setAccessToken = (access_token) => this.spotify.setAccessToken(access_token);
    // getAccessToken = () => this.spotify.getAccessToken();

    // getMe = async () => await this.spotify.getMe().then(res => {
    //   console.log(res)
    //   this.setState({spotifyUser: res});
    //   localStorage.setItem("spotifyUser", JSON.stringify(res));
    // })

    checkTime = async () => {
      if (this.state.auth && new Date() > this.state.auth.expiresAt){
        console.log("sending refresh token to backend...")
        return await axios.get(`https://randofy-backend.herokuapp.com/token/refresh`, {
          params: {refresh_token: this.state.auth.refresh_token}
        })
        .then(response => {
          response.data.createdAt = new Date();
          response.data.expiresAt = new Date().setMinutes(response.data.createdAt.getMinutes() + 30);
          localStorage.setItem("auth", JSON.stringify(response.data));
          this.setState({auth: response.data})
          return (1);
        })
        .catch(error => {
          // invalid refresh token = re-auth/login
          // server timeout = backend broke, oops
          console.error("what happened? ", error);
        })
      }
    }

    //get current user (Me)
    getMe = async () => {
      await this.checkTime();
      return await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          'Authorization': `Bearer ${this.state.auth.access_token}`
        }
        })
      .then(response => {
        console.log("TELL ME", response)
        this.setState({spotifyUser: response.data});
          console.log(this.state.spotifyUser);
          localStorage.setItem('spotifyUser', JSON.stringify(response.data));
          console.log('res', response);
          setTimeout(() => {
            location.replace(window.location.host.includes("localhost") ? "http://" : "https://" +  window.location.host)
          }, 500);
      })
      .catch(err => console.error(err))
    }
    
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
          response.data.createdAt = new Date();
          response.data.expiresAt = new Date().setMinutes(response.data.createdAt.getMinutes() + 30);
          
          localStorage.setItem("auth", JSON.stringify(response.data));
          this.setState({auth: response.data}, () => {
            this.getMe();
          });
          console.log("bad request?", response);
        })
        .catch(error => {
          console.log("bad request, get new code / log back in (aka reroute to login)",error);
        })
    };

    async componentDidMount(){
      // check to see if last session is valid
      const auth = JSON.parse(localStorage.getItem("auth"));
      if (auth){
        this.setState({ auth });
      }

      const playlist = JSON.parse(localStorage.getItem("playlist"));
      if (playlist){
        this.setState({ playlist });
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
        }, () => {
          this.checkPlaylist();
        })
        // we have the user or 'me'
      }
      else {
        console.log("does no have storage")
        const params = new URLSearchParams(window.location.search.substring(1))
        let code = params.get("code");
        // get the spotifyUser with the code
        if (code){
          await this.tokenCall(code);
          await this.checkPlaylist();
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