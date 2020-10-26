import React from 'react';
import PropTypes from 'prop-types';
import {encodeForURI} from '@nti/lib-ntiids';
import {resolveBasePath} from '@nti/web-client';

import Path from './Path';

global.getObjectURL = getObjectURL;

function getObjectURL (ntiid) {
	if (!ntiid) {
		return '#';
	}

	return `${resolveBasePath()}object/${encodeForURI(ntiid, true)}`;
}

function getPathForObject (obj) { return getObjectURL((!obj || typeof obj === 'string') ? obj : obj.NTIID); }

function getPath (router, object, context) {
	if (typeof object === 'string' || !router.getRouteFor) {
		return getPathForObject(object);
	}

	const path = router.getRouteFor(object, context);

	return path || getPathForObject(object);
}

export default class ObjectLink extends React.Component {
	static getPathFor = getPathForObject
	static getPathWithRouter = getPath;

	static routeTo (router, object, context) {
		const path = getPath(router, object, context);

		if (typeof path === 'function') {
			return path();
		}

		return Path.routeTo(router, path);
	}

	static propTypes = {
		object: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.string
		]),
		as: PropTypes.any,
		onClick: PropTypes.func,
		context: PropTypes.any
	}

	static contextTypes = {
		router: PropTypes.shape({
			getRouteFor: PropTypes.func
		})
	}

	state = {path: '#'};

	get router () {
		return this.context.router || {};
	}

	get getRouteFor () {
		const {router} = this;

		return router.getRouteFor;
	}

	componentDidMount () {
		this.setupFor(this.props);
	}

	componentDidUpdate (prevProps) {
		const {object:oldObject, context:oldContext} = prevProps;
		const {object:newObject, context:newContext} = this.props;

		if (oldObject !== newObject || oldContext !== newContext) {
			this.setupFor(this.props);
		}
	}


	setupFor (props) {
		const {object, context} = this.props;

		this.setState({
			path: getPath(this.router, object, context)
		});
	}


	onClick = (e) => {
		const {onClick} = this.props;
		const {path} = this.state;

		if (onClick) {
			onClick(e);
		}

		if (typeof path === 'function' && !e.defaultPrevented) {
			path(e);
			e.preventDefault();
		}
	}

	render () {
		const { as: tag, ...otherProps} = this.props;
		const Cmp = tag || Path;
		const {path} = this.state;

		delete otherProps.object;
		delete otherProps.context;

		let pathProps = {};

		if (typeof path === 'function') {
			pathProps.to = '#';
			pathProps.onClick = this.onClick;
		} else if (typeof path === 'string') {
			pathProps.to = path;
		} else {
			pathProps.to = path.href;
			pathProps.replace = path.replace;
			pathProps.target = path.target;
			pathProps.download = path.download;
			pathProps.onClick = path.onClick;
		}

		return (
			<Cmp {...otherProps} {...pathProps} />
		);
	}
}
