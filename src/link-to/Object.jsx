import React from 'react';
import PropTypes from 'prop-types';
import {encodeForURI} from 'nti-lib-ntiids';

import Path from './Path';

function getObjectURL (ntiid) {
	return `/object/${encodeForURI(ntiid, true)}`;
}

export default class ObjectLink extends React.Component {
	static getPathFor (obj) { return getObjectURL(obj.ntiid || obj); }

	static propTypes = {
		object: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.string
		])
	}

	static contextTypes = {
		router: PropTypes.shape({
			getRouteFor: PropTypes.func
		})
	}

	get router () {
		return this.context.router || {};
	}

	get getRouteFor () {
		const {router} = this;

		return router.getRouteFor;
	}

	getPathFor (object) {
		const {getRouteFor} = this;

		if (typeof object === 'string' || !getRouteFor) { return getObjectURL(object); }

		const path = getRouteFor(object);

		return path || ObjectLink.getPathFor(object);
	}

	render () {
		const {object, ...otherProps} = this;
		const path = this.getPathFor(object);

		return (
			<Path to={path} {...otherProps} />
		);
	}
}
