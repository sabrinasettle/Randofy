import React from 'react';
import Link from '@mui/material/Link';

class NavLink extends React.Component {
	render() {
		return <Link href={this.props.location}>{this.props.text}</Link>;
	}
}

export default NavLink;
