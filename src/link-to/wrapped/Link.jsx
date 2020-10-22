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
	const context = useContext(RouterContext);

	if (legacyContext.router?.disabled) {
		const Cmp = as || 'div';
		return (<Cmp {...props} />);
	}

	const maybeTopNav = useCallback(() => topLevelNavigate(props.to, props.replace), [props.to, props.replace]);

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
	download: PropTypes.bool,
	beforeNavigation: PropTypes.func,
};

export default WrappedLink;
