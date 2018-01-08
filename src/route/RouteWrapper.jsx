import React from 'react';
import PropTypes from 'prop-types';

import {getParamProps, isFrameless} from './utils';

export default class RouteWrapper extends React.Component {
	static propTypes = {
		routeProps: PropTypes.object,
		componentProps: PropTypes.object,
		routerProps: PropTypes.object,//extra props given to the router that we are passing a long

		component: PropTypes.any,
		frame: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.func
		]),

		frameless: PropTypes.bool
	}

	static contextTypes = {
		router: PropTypes.object
	}

	static childContextTypes = {
		router: PropTypes.shape({
			baseroute: PropTypes.string
		})
	}


	getChildContext () {
		const {router} = this.context;
		const {routeProps} = this.props;
		const {match} = routeProps || {};

		return {
			router: {
				...router,
				baseroute: match ? match.url : router.baseroute
			}
		};
	}


	render () {
		const {routeProps, routerProps, componentProps, component:Component, frame: Frame, frameless} = this.props;
		const params = getParamProps(routerProps);
		const component = (<Component {...routeProps} {...routerProps} {...componentProps} {...params} />);

		return isFrameless(Frame, frameless) ?
			component :
			(
				<Frame {...routeProps} {...routerProps} {...params} frameless={frameless}>
					{component}
				</Frame>
			);
	}

}
