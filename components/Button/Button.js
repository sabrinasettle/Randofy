import React from 'react';
import { Link } from '@material-ui/core';

class NavLink extends React.Component {
    render() {
        return (
            <Link href= {this.props.location}>
                {this.props.text}
            </Link>
        )
    }
};

export default NavLink;