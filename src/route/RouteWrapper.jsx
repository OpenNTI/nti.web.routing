import React from 'react';
import PropTypes from 'prop-types';

import {getParamProps, isFrameless} from './utils';

RouteWrapper.propTypes = {
	routeProps: PropTypes.object,
	componentProps: PropTypes.object,
	routerProps: PropTypes.object,//extra props given to the router that we are passing a long

	component: PropTypes.any,
	frame: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.func
	]),

	frameless: PropTypes.bool
};
export default function RouteWrapper ({routeProps, routerProps, componentProps, component:Component, frame:Frame, frameless}) {
	const params = getParamProps(routeProps);
	const component = (<Component {...routeProps} {...routerProps} {...componentProps} {...params} />);

	return isFrameless(Frame, frameless) ?
		component :
		(
			<Frame {...routeProps} {...routerProps} {...params} frameless={frameless}>
				{component}
			</Frame>
		);
}
