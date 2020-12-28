import React, { Component } from 'react';
import SpotifyContext from './context'
// first we will make a new context
const withSpotify = Component => {
  class WithSpotify extends Component {
    constructor(props) {
      super(props);
      this.State = {
        spotifyUser: {},
      };
    };

    componentDidMount(){
      // Check to see if the user exists then if not and have access_token then get the user
      // let code = localStorage.getItem('code')
      const params = new URLSearchParams(window.location.search.substring(1))
      const code = params.get("code");
      console.log("from SPUSER", code)

      // create listener


    };

    componentWillUnmount() {
      // remove listener - for protection from leaks

    };

    render(){
      return(
        <SpotifyContext.Provider value={this.state.spotifyUser}> 
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