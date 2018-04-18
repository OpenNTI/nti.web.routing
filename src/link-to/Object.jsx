import React from 'react';
import PropTypes from 'prop-types';
import {encodeForURI} from '@nti/lib-ntiids';

import Path from './Path';

function getObjectURL (ntiid) {
	if (!ntiid) {
		return '#';
	}

	return `/object/${encodeForURI(ntiid, true)}`;
}

export default class ObjectLink extends React.Component {
	static getPathFor (obj) { return getObjectURL((!obj || typeof obj === 'string') ? obj : obj.NTIID); }

	static propTypes = {
		object: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.string
		]),
		context: PropTypes.any
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

	getPathFor (object, context) {
		const {getRouteFor} = this;

		if (typeof object === 'string' || !getRouteFor) { return ObjectLink.getPathFor(object); }

		const path = getRouteFor(object, context);

		return path || ObjectLink.getPathFor(object);
	}

	render () {
		const {object, context, ...otherProps} = this.props;
		const path = this.getPathFor(object, context);

		let pathProps = {};

		if (typeof path === 'string') {
			pathProps.to = path;
		} else {
			pathProps.to = path.href;
			pathProps.replace = path.replace;
			pathProps.target = path.target;
			pathProps.download = path.download;
		}

		return (
			<Path {...otherProps} {...pathProps} />
		);
	}
}
