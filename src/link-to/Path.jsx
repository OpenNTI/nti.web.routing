import React from 'react';
import PropTypes from 'prop-types';
import {Link, NavLink} from 'react-router-dom';

import {resolve} from '../utils';

export default class PathLink extends React.Component {
	static propTypes = {
		to: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),
		activeClassName: PropTypes.string,
		activeStyle: PropTypes.object
	}

	static contextTypes = {
		router: PropTypes.shape({
			baseroute: PropTypes.tring
		})
	}


	get router () {
		return this.context.router || {};
	}


	get baseroute () {
		const {router} = this;

		return router.baseroute || '';
	}


	render () {
		const {to, activeClassName, activeStyle, ...otherProps} = this.props;
		const path = resolve(this.baseroute, to);

		return activeClassName || activeStyle ?
			(<NavLink to={path} activeClassName={activeClassName} activeStyle={activeStyle} {...otherProps} />) :
			(<Link to={path} {...otherProps} />);
	}
}
