import React from 'react';
import PropTypes from 'prop-types';

import Path from './Path';

export default class NameLink extends React.Component {
	static propTypes = {
		name: PropTypes.string,
		params: PropTypes.object
	}

	static contextTypes = {
		router: PropTypes.shape({
			getRouteFor: PropTypes.func
		})
	}

	get router () {
		return this.context.router || {};
	}

	get getRouteFor () {
		const {router} = this;

		return router.getRouteFor;
	}

	getPathFor (name, params) {
		const {getRouteFor} = this;

		return getRouteFor ? (getRouteFor(name, params) || name) : name;
	}

	render () {
		const {name, params, ...otherProps} = this.props;
		const path = this.getPathFor(name, params);

		return (
			<Path to={path} {...otherProps} />
		);
	}
}
