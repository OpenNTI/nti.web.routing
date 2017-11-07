import React from 'react';
import PropTypes from 'prop-types';
import {Router} from 'react-router-dom';

import getHistory from '../history';

export default class BrowserRouter extends React.Component {
	static propTypes = {
		children: PropTypes.node
	}

	history =  getHistory()

	render () {
		const {history} = this;

		return (
			<Router history={history}>
				{this.props.children}
			</Router>
		);
	}
}
