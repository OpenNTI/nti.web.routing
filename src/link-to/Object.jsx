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
		const {object, context} = props;
		const {getRouteFor} = this;

		if (typeof object === 'string' || !getRouteFor) { return ObjectLink.getPathFor(object); }

		const path = getRouteFor(object, context);

		this.setState({
			path: path || ObjectLink.getPathFor(object, context)
		});
	}


	onClick = (e) => {
		const {path} = this.state;

		if (typeof path === 'function') {
			path(e);
			e.preventDefault();
		}
	}

	render () {
		const { ...otherProps} = this.props;
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
		}

		return (
			<Path {...otherProps} {...pathProps} />
		);
	}
}
