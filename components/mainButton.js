import axios from 'axios';
import React from 'react'
import SongCard from '../components/songCard'
import styles from '../styles/MainButton.module.scss'
import Color from 'color-thief-react'

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
            imgImg: null,
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
        
        axios.get(`https://randofy-backend.herokuapp.com/random`)
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
                imgImg: response.data.album_image.url
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
        let img = this.state.imgImg


        const text = 'Click the button to get a random song!';
        const classFont = '';
        const direction = 1;
        const arc = 150;

        if (isLoaded)
            console.log("img", img);
        return (
            // <input type="button" disabled={isSending} onClick={sendRequest} />
            <div className="section">
                {isLoaded ? 
                    <div className={styles.return}> 
                        <Color src={img} crossOrigin="anonymous" format="hex">
                            {({ data, loading }) => {
                            // if (loading) return <Loading />;
                            console.log("data", data)
                            let color = data
                            return (
                                <div className={styles.cardsection} style={{backgroundColor: `${color}`}}>
                                        {/* // <p style={{color: data}}>Predominant color: <strong>{data}</strong></p> */}
                                        <SongCard data={this.state.songData} /> 
                                    </div>
                                );
                            }}
                        </Color>
                        <div className={styles.buttonsection}>
                            <button className={styles.trackbutton} onClick={this.handleClick}>Get another random song</button>
                        </div>
                    </div>
                : 
                <div className={styles.return}>
                    <div className={styles.sectioncenter}>
                    
                        <h1 className={styles.instructfill}>Click the button to get a random song!</h1>
                        <button className={styles.newsongbutton} onClick={this.handleClick}>{isLoaded ?  'Get another random song': 'Get a random song' }</button>
                        {/* <SongCard data={this.state.songData} /> */}
                    </div>
                </div>
                }
            </div>
        )
    }

}


export default MainButton;