import React from 'react';
import PropTypes from 'prop-types';

export default class RouteForProvider extends React.Component {
	static propTypes = {
		getRouteFor: PropTypes.func,
		children: PropTypes.any,
	};

	static contextTypes = {
		router: PropTypes.shape({
			getRouteFor: PropTypes.func,
		}),
	};

	static childContextTypes = {
		router: PropTypes.shape({
			getRouteFor: PropTypes.func,
		}),
	};

	getChildContext() {
		return {
			router: {
				...this.context.router,
				getRouteFor: (...args) => this.getRouteFor(...args),
			},
		};
	}

	get router() {
		return this.context.router || {};
	}

	get parentGetRouteFor() {
		return this.router.getRouteFor;
	}

	getRouteFor(...args) {
		const { getRouteFor } = this.props;
		const { parentGetRouteFor } = this;

		const route = getRouteFor && getRouteFor(...args, this.router);

		return route || (parentGetRouteFor && parentGetRouteFor(...args));
	}

	render() {
		const { children } = this.props;

		return children;
	}
}
