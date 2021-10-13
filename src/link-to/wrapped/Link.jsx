 
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { ContextMerger } from '../../router/utils/context-merger';

import NestableAnchor from './NestableAnchor';
import routeTo, { topLevelNavigate } from './route-to';

/*
 * The public API for rendering a history-aware <a>.
 */
const WrappedLink = React.forwardRef(({ component: as, ...props }, ref) => {
	const maybeTopNav = useCallback(
		() => topLevelNavigate(props.to, props.replace),
		[props.to, props.replace]
	);
	return (
		<ContextMerger>
			{context => {
				if (context?.disabled) {
					const Cmp = as || 'span';
					return <Cmp {...props} />;
				}

				if (!props.to && props.href) {
					const Cmp = as || 'a';
					return <Cmp {...props} />;
				}

				return (
					<Link
						{...props}
						ref={ref}
						as={as}
						component={NestableAnchor}
						_maybeNavigateTop={maybeTopNav}
					/>
				);
			}}
		</ContextMerger>
	);
});

WrappedLink.displayName = 'WrappedLink';

WrappedLink.routeTo = routeTo;

WrappedLink.propTypes = {
	...Link.propTypes,
	to: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.object,
		PropTypes.func,
	]),
	href(props) {
		if (props.to && props.href) {
			return new Error(
				'Should not supply href AND to props to WrappedLink'
			);
		}

		if (
			(props.href != null && typeof props.href !== 'string') ||
			props.href === ''
		) {
			return new Error('href should be a non-empty string');
		}
	},
	download: PropTypes.bool,
	beforeNavigation: PropTypes.func,
};

export default WrappedLink;
