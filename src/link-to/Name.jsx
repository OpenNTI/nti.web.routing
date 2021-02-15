import React from 'react';
import PropTypes from 'prop-types';

import Path from './Path';

function getPath(router, name, params) {
	return router && router.getRouteFor
		? router.getRouteFor(name, params) || name
		: name;
}

export default class NameLink extends React.Component {
	static routeTo(router, name, params) {
		const path = getPath(router, name, params);

		return Path.routeTo(router, path);
	}

	static propTypes = {
		name: PropTypes.string,
		params: PropTypes.object,
		as: PropTypes.any,
	};

	static contextTypes = {
		router: PropTypes.shape({
			getRouteFor: PropTypes.func,
		}),
	};

	get router() {
		return this.context.router || {};
	}

	getPathFor(name, params) {
		const { router } = this;

		return getPath(router, name, params);
	}

	render() {
		const { name, params, as: tag, ...otherProps } = this.props;
		const path = this.getPathFor(name, params);
		const Cmp = tag || Path;

		return <Cmp to={path} {...otherProps} />;
	}
}
