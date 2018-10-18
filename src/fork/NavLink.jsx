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
	onActivate: PropTypes.func,
	onDeactivate: PropTypes.func,
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
	'aria-current': 'true',
	onActivate: () => {},
	onDeactivate: () => {}
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
		onActivate,
		onDeactivate,
		isActive: getIsActive,
		'aria-current': ariaCurrent,
		...rest
	} = props;

	let wasActive = false;

	return (
		<Route
			path={decodeURI(typeof to === 'object' ? to.pathname : to)}
			exact={exact}
			strict={strict}
			location={location}
		>
			{({location:routeLocation, match}) => {
				const isActive = !!(getIsActive ? getIsActive(match, routeLocation) : match);

				if (isActive && !wasActive) {
					onActivate();
				} else if (!isActive &&  wasActive) {
					onDeactivate();
				}

				wasActive = isActive;

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
		</Route>
	);
}
