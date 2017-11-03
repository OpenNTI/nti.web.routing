import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

RouteWrapper.propTypes = {
	route: PropTypes.object,
	basepath: PropTypes.string
};
export default function RouteWrapper ({route}, basepath) {
	const {path, ...otherProps} = route.getRouteConfig();

	return (
		<Route path={path} {...otherProps} />
	);
}
