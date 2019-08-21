import React from 'react';
import PropTypes from 'prop-types';

export default class HashRoute extends React.Component  {
	static propTypes = {
		matches: PropTypes.string.isRequired,
		render: PropTypes.func.isRequired
	}

	static contextTypes = {
		router: PropTypes.shape({
			route: PropTypes.shape({
				location: PropTypes.shape({
					hash: PropTypes.string
				})
			})
		})
	}


	get router () {
		return this.context.router;
	}

	get route () {
		return (this.router || {}).route;
	}

	get location () {
		return (this.route || {}).location;
	}

	get hash () {
		return (this.location || {}).hash;
	}

	setHash = () => {
		const {router, location} = this;

		if (!router) { return; }

		return router.routeTo.path(location.pathname);
	}

	render () {
		const {matches, render} = this.props;

		return this.hash === matches ? render(this.hash, this.setHash) : null;
	}
}