/* eslint-disable no-unused-vars */
import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { __RouterContext as RouterContext } from 'react-router';
import {Link} from 'react-router-dom';

import NestableAnchor from './NestableAnchor';
import routeTo, { topLevelNavigate } from './route-to';


/*
 * The public API for rendering a history-aware <a>.
 */
const WrappedLink = ({component: as, ...props}, legacyContext) => {
	const maybeTopNav = useCallback(() => topLevelNavigate(props.to, props.replace), [props.to, props.replace]);
	const context = useContext(RouterContext);

	if (legacyContext.router?.disabled) {
		const Cmp = as || 'div';
		return (<Cmp {...props} />);
	}

	if (!props.to && props.href) {
		const Cmp = as || 'a';
		return <Cmp {...props}/>;
	}

	return (
		<RouterContext.Provider value={context || legacyContext.router}>
			<Link {...props}
				as={as}
				component={NestableAnchor}
				_maybeNavigateTop={maybeTopNav}
			/>
		</RouterContext.Provider>
	);
};

WrappedLink.displayName = 'WrappedLink';

WrappedLink.routeTo = routeTo;

WrappedLink.contextTypes = {
	router: PropTypes.shape({
		disabled: PropTypes.bool
	})
};

WrappedLink.propTypes = {
	...Link.propTypes,
	to: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.object,
		PropTypes.func
	]),
	href (props) {
		if (props.to && props.href) {
			return new Error('Should not supply href AND to props to WrappedLink');
		}

		if (props.href != null && typeof props.href !== 'string' || props.href === '') {
			return new Error('href should be a non-empty string');
		}
	},
	download: PropTypes.bool,
	beforeNavigation: PropTypes.func,
};

export default WrappedLink;
