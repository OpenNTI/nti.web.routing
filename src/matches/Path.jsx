import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router';

export default class MatchesPath extends React.Component {
	static propTypes = {
		path: PropTypes.string.isRequired,
		render: PropTypes.func,
	};

	render() {
		const { render, ...other } = this.props;
		return <Route {...other}>{props => render(props)}</Route>;
	}
}
