import React from 'react';
import PropTypes from 'prop-types';
import {
	BrowserRouter,
	Route,
	Switch
} from 'react-router-dom';

import RouterConfig from './RouterConfig';

export default class Router extends React.Component {
	static for (...args) {
		const router = new RouterConfig(...args);

		TempRouter.Router = router;
		function TempRouter (props) {
			return (<Router _router={router} {...props} />);
		}

		return TempRouter;
	}

	static propTypes = {
		_router: PropTypes.object.isRequired,
		match: PropTypes.object,
		basepath: PropTypes.string,
		children: PropTypes.node
	}

	static contextTypes = {
		router: PropTypes.shape({
			history: PropTypes.object,
			route: PropTypes.object
		})
	}

	static childContextTypes = {
		router: PropTypes.shape({
			getRouteFor: PropTypes.func
		})
	}

	getChildContext () {
		return {
			router: {
				...this.context.router,
				getRouteFor: (...args) => this.getRouteFor(...args)
			}
		};
	}

	get router () {
		return this.context.router;
	}


	get history () {
		const {router} = this;

		return router ? router.history : null;
	}

	get route () {
		const {router} = this;

		return router ? router.route : null;
	}

	get baseroute () {
		const {route} = this;
		const {match:propMatch} = this.props;
		const match = propMatch || (route && route.match);

		return match ? match.url : '';
	}


	getRouteFor (...args) {
		const {baseroute} = this;
		const {_router} = this.props;

		return _router.getRouteFor(baseroute, ...args);
	}


	render () {
		const {history} = this;

		return history ?
			this.renderRoutes() :
			this.renderRouter();
	}


	renderRouter () {
		const {basepath} = this.props;

		return (
			<BrowserRouter basepath={basepath}>
				{this.renderRoutes()}
			</BrowserRouter>
		);
	}


	renderRoutes () {
		const {_router, children} = this.props;

		if (!_router) {
			return React.Children.only(children);
		}
		debugger;
		return (
			<Switch>
				{_router.map((route, index) => this.renderRoute(route, index))}
			</Switch>
		);
	}


	renderRoute (route, index) {
		const {baseroute} = this;
		const config = route.getRouteConfig(baseroute);

		return (
			<Route key={index} {...config} />
		);
	}
}
