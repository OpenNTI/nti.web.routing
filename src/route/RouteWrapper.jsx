import React from 'react';
import PropTypes from 'prop-types';
import {PropTypes as PT} from '@nti/lib-commons';

import {getParamProps, isFrameless} from './utils';

RouteWrapper.propTypes = {
	routeProps: PropTypes.object,
	componentProps: PropTypes.object,
	routerProps: PropTypes.object,//extra props given to the router that we are passing along

	component: PropTypes.any,
	frame: PT.component,

	frameless: PropTypes.bool
};
export default function RouteWrapper ({routeProps, routerProps, componentProps, component, frame:Frame, frameless}) {
	const params = getParamProps(routeProps);

	const props = {
		...routeProps,
		...routerProps,
		...componentProps,
		...params,
		component
	};

	return isFrameless(Frame, frameless) ? (
		<Child {...props} />
	) : (
		<Frame {...routeProps} {...routerProps} {...params} frameless={frameless}>
			<Child {...props} />
		</Frame>
	);
}

Child.propTypes = {
	component: PropTypes.any
};

// Establishing this as its own component helps prevent umounting and remounting when parent props change,
// and deferring instantiation avoids premature prop-type checks. (Frame might add required props via clone.)
function Child ({component: Component, ...props}) {
	return (
		<Component {...props} />
	);
}
