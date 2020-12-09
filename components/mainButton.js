import React from 'react'
import SongCard from '../components/songCard'
import styles from '../styles/MainButton.module.scss'


// onClick fetch data from backend and then use loader

class MainButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            isLoaded: false,
            // song: null,
            songData: null,
            type: this.props.type ? this.props.type : "track",
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
        // send type based on user input
        fetch(`https://randify-backend.herokuapp.com/random`)
        .then(res => res.json())
          .then(data => {
            console.log("on click", data);
            if (this.props.updateList){
                this.props.updateList(data);
            }
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
        // console.log('song data state',this.state.songData)
    }

    render() {
        // if type is track or album change the button text based on that
        let {songData, isLoaded} = this.state;
        return (
            // <input type="button" disabled={isSending} onClick={sendRequest} />
            <div className="section1">
                <button className={styles.trackbutton} onClick={this.handleClick}>{isLoaded ?  'Get another random song': 'Get a random song' }</button>
                <div className={styles.return}>
                    {/* {songData === null ? <p>No song data</p> : <p>Song Data set</p> } */}
                    {isLoaded ? <SongCard data={this.state.songData} /> : <h1 className={styles.instructfill}>Get a new track or album!</h1>}
                    {/* <SongCard data={this.state.songData} /> */}
                </div>
                
            </div>
        )
    }

}


export default MainButton;