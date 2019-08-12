import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';

import {resolve} from '../utils';

export default class PathRedirect extends React.Component {
	static propTypes = {
		to: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		])
	}

	static contextTypes = {
		router: PropTypes.shape({
			baseroute: PropTypes.string
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
		const {to, ...otherProps} = this.props;
		const path = resolve(this.baseroute, to);

		return (
			<Redirect to={path} {...otherProps} />
		);
	}
}