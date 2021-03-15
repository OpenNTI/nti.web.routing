/* eslint react/jsx-no-bind:0 */
import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import Link from './Link';

let ACTIVE_MAP = {};

/*
 * A <Link> wrapper that knows if it's "active" or not.
 */
export const NavLink = React.forwardRef((props, ref) => {
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

	return (
		<Route
			path={decodeURI(typeof to === 'object' ? to.pathname : to)}
			exact={exact}
			strict={strict}
			location={location}
		>
			{({ location: routeLocation, match }) => {
				const isActive = !!(getIsActive
					? getIsActive(match, routeLocation)
					: match);

				let wasActive = ACTIVE_MAP[to];

				if (isActive && !wasActive) {
					onActivate();
				} else if (!isActive && wasActive) {
					onDeactivate();
				}

				if (!isActive) {
					delete ACTIVE_MAP[to];
				} else {
					ACTIVE_MAP[to] = isActive;
				}

				return (
					<Link
						ref={ref}
						to={to}
						className={
							isActive
								? [className, activeClassName]
										.filter(i => i)
										.join(' ')
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
});

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
		'true',
	]),
};
NavLink.defaultProps = {
	activeClassName: 'active',
	'aria-current': 'true',
	onActivate: () => {},
	onDeactivate: () => {},
};

export default NavLink;
