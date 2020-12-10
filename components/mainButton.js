import axios from 'axios';
import React from 'react'
import SongCard from '../components/songCard'
import styles from '../styles/MainButton.module.scss'


// onClick fetch data from backend and then use loader

class MainButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: "",
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
    
    
    handleClick = () => {
        
        axios.get(`https://randify-backend.herokuapp.com/random`)
        .then(response => {
            console.log("response from axios", response.data);
            console.log("test", this.state.isLoaded)
            if (this.props.updateList){
                console.log("props from parent exist")
                this.props.updateList(response.data);
            }
            this.setState({
                isLoaded: true,
                songData: response.data,
            });
          })
          .catch(error => {
            console.log("error", error);
            this.setState({
                isLoaded: true,
                error: error,
            });
          })
    
        // console.log("Clicked!");
        // console.log(self.state.isLoaded)
        // console.log('song data state', self.state.songData)
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