import React from 'react'
import SongCard from '../components/songCard'

// onClick fetch data from backend and then use loader

class MainButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            isLoaded: false,
            // song: null,
            songData: null,
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        //   fetch(`https://spotify-randomizer-backend.herokuapp.com/random`)
        //   .then(res => res.json())
        //   .then(data => {
        //     console.log(data);
        //   })
        //   .then(
        //       (data) => {
        //           this.setState({
        //               isLoaded: true,
        //               song: data,
        //           });
        //       },
        //       (error) => {
        //           this.setState({
        //               isLoaded: true,
        //               error: true,
        //           });
        //       }
        //   )

        //   console.log(this.state.data);
    }

    // useEffect(() => {
        // const result = await axios(
        //     'https://hn.algolia.com/api/v1/search?query=redux',
        // );
    
        // setData(result.data);
    // });
    // useEffect(() => {
    //     // Update the document title using the browser API
    //     document.title = `You clicked ${count} times`;
    // });
    
    
    handleClick() {
        fetch(`https://spotify-randomizer-backend.herokuapp.com/random`)
        .then(res => res.json())
          .then(data => {
            console.log("on click", data);
            this.setState({
                isLoaded: true,
                songData: data,
            }, () => {
            console.log("after set state", this.state.songData, this.state.isLoaded);
            }); 
              },
              (error) => {
                  this.setState({
                      isLoaded: true,
                      error: true,
                  });
              }
          )

        console.log("Clicked!");
        console.log(this.state.isLoaded)
        console.log('song data state',this.state.songData)
    }

    render() {
        let {songData, isLoaded} = this.state;
        return (
            
            // <input type="button" disabled={isSending} onClick={sendRequest} />
            <div>
                <button onClick={this.handleClick}>Click Me</button>
                {songData === null ? <p>Song Data set</p> : <p>No song data</p>}
                {isLoaded ? <SongCard data={this.state.songData} /> : <p>not loaded</p>}
                {/* <SongCard data={this.state.songData} /> */}
            </div>
        )
    }

}


export default MainButton;