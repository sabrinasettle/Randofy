import React, { Component } from 'react';

// first we will make a new context
const NoteContext = React.createContext();

// Then create a provider Component
class NoteProvider extends Component {
  state = {
    spotifyUser: localStorage ? JSON.parse(localStorage.getItem('spotifyUser')) : null,
  };
  render() {
    return (
      <NoteContext.Provider
        value={{
          state: this.state,
        }}
      >
        {this.props.children}
      </NoteContext.Provider>
    );
  }
}

// then make a consumer which will surface it
const NoteConsumer = NoteContext.Consumer;

export default NoteProvider;
export { NoteConsumer };