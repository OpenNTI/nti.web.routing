import React from 'react';
import PropTypes from 'prop-types';

import {getParamProps, isFrameless} from './utils';

RouteWrapper.propTypes = {
	routeProps: PropTypes.object,
	componentProps: PropTypes.object,

	component: PropTypes.node,
	frame: PropTypes.element,

	frameless: PropTypes.bool
};
export default function RouteWrapper ({routeProps, componentProps, component:Component, frame:Frame, frameless}) {
	const params = getParamProps(routeProps);
	const component = (<Component {...routeProps} {...componentProps} {...params} />);

	return isFrameless(Frame, frameless) ?
		component :
		(
			<Frame {...routeProps} {...params} frameless={frameless}>
				{component}
			</Frame>
		);
}
