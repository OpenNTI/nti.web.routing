/* eslint react/jsx-no-bind:0 */
import React from 'react';
import PropTypes from 'prop-types';
import {Route} from 'react-router-dom';

import Link from './Link';


/*
 * A <Link> wrapper that knows if it's "active" or not.
 */
NavLink.propTypes = {
	to: Link.propTypes.to,
	exact: PropTypes.bool,
	strict: PropTypes.bool,
	location: PropTypes.object,
	activeClassName: PropTypes.string,
	className: PropTypes.string,
	activeStyle: PropTypes.object,
	style: PropTypes.object,
	isActive: PropTypes.func,
	'aria-current': PropTypes.oneOf([
		'page',
		'step',
		'location',
		'date',
		'time',
		'true'
	])
};
NavLink.defaultProps = {
	activeClassName: 'active',
	'aria-current': 'true'
};
export default function NavLink (props) {
	const {
		to,
		exact,
		strict,
		location,
		activeClassName,
		className,
		activeStyle,
		style,
		isActive: getIsActive,
		'aria-current': ariaCurrent,
		...rest
	} = props;

	const path = typeof to === 'object' ? to.pathname : to;
	// Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202
	const escapedPath = path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');

	return (
		<Route
			path={escapedPath}
			exact={exact}
			strict={strict}
			location={location}
			render={({location:routeLocation, match}) => {
				const isActive = !!(getIsActive ? getIsActive(match, routeLocation) : match);

				return (
					<Link
						to={to}
						className={
							isActive
								? [className, activeClassName].filter(i => i).join(' ')
								: className
						}
						style={isActive ? { ...style, ...activeStyle } : style}
						aria-current={(isActive && ariaCurrent) || null}
						{...rest}
					/>
				);
			}}
		/>
	);
}
