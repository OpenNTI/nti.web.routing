import React from 'react';
import PropTypes from 'prop-types';

export default class DisabledRouter extends React.Component {
	static propTypes = {
		children: PropTypes.node,
	};

	static childContextTypes = {
		router: PropTypes.shape({
			disabled: PropTypes.bool,
		}),
	};

	getChildContext() {
		return {
			router: {
				disabled: true,
			},
		};
	}

	render() {
		return React.Children.only(this.props.children);
	}
}
