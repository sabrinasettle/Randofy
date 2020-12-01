import React from 'react'
// onClick fetch data from backend and then use loader

class MainButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetchingData: false,
            // song: null,
        };
        this.handleClick = this.handleClick.bind(this);
      }
    
      handleClick() {
        this.setState(state => ({
          fetchingData: !state.fetchingData
        }));
        console.log("Clicked!");
      }

    render() {
        return (
            <button onClick={this.handleClick}>Click Me</button>
        )
    }

}

export default MainButton;