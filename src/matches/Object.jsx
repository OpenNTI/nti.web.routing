import React from 'react';
import PropTypes from 'prop-types';
import Logger from '@nti/util-logger';

import {Object as ObjectLink} from '../link-to';

import Path from './Path';

const logger = Logger.get('nti-web-routing:matches:object');

export default class MatchesObject extends React.Component {

	static propTypes = {
		object: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.string
		]),
		render: PropTypes.func
	}

	render () {
		const {
			props: {object}
		} = this;

		let path;

		try {
			path = ObjectLink.getPathFor(object);
		}
		catch (e) {
			logger.warn('Unable to get path for object. %o', e);
			return null;
		}

		const props = {
			...this.props,
			path
		};

		return (
			<Path {...props} />
		);
	}
}
