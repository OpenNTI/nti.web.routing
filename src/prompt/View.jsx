import React from 'react';
import PropTypes from 'prop-types';

import {addPrompt} from './Store';

class RouterPromptInner extends React.Component {
	static propTypes = {
		onRoute: PropTypes.func.isRequired
	}

	static contextTypes = {
		router: PropTypes.shape({
			history: PropTypes.object
		}).isRequired
	}

	get history () {
		return this.context.router.history;
	}

	componentDidMount () {
		const {onRoute} = this.props;

		this.release = addPrompt(onRoute, this.history);
	}


	componentWillUnmount () {
		this.release();
	}


	componentDidUpdate (prevProps) {
		const {onRoute} = this.props;
		const {onRoute:prevOnRoute} = prevProps;

		if (onRoute !== prevOnRoute) {
			this.release();
			this.release = addPrompt(onRoute, this.history);
		}
	}

	render () {
		return null;
	}
}

export default class RouterPrompt extends React.Component {
	static propTypes = {
		when: PropTypes.bool
	}


	render () {
		const {when, ...otherProps} = this.props;

		if (!when) { return null; }

		return (
			<RouterPromptInner {...otherProps} />
		);
	}
}
