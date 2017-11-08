import React from 'react';
import PropTypes from 'prop-types';
import {
	Route,
	Switch
} from 'react-router-dom';

import BrowserRouter from './BrowserRouter';
import RouterConfig from './RouterConfig';

export default class Router extends React.Component {
	static connect (...args) {
		const router = new RouterConfig(...args);

		return function (Component) {
			TempRouter.Router = router;
			function TempRouter (props) {
				return (
					<Component {...props}>
						<Router _router={router} {...props} />
					</Component>
				);
			}

			return TempRouter;
		};
	}

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
		routeProps: PropTypes.object,

		match: PropTypes.object,
		children: PropTypes.node
	}

	static contextTypes = {
		router: PropTypes.shape({
			history: PropTypes.object,
			route: PropTypes.object,
			getRouteFor: PropTypes.func
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
				getRouteFor: (...args) => this.getRouteFor(...args),
				baseroute: this.baseroute
			}
		};
	}

	get router () {
		return this.context.router || {};
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
		const {route, router} = this;
		const {match:propMatch} = this.props;
		const match = propMatch || (route && route.match);

		return match ? match.url : (router.baseroute || '');
	}


	get parentGetRouteFor () {
		return this.router.getRouteFor;
	}


	getRouteFor (...args) {
		const {baseroute, parentGetRouteFor} = this;
		const {_router} = this.props;

		const route = _router.getRouteFor(baseroute, ...args);

		return route || (parentGetRouteFor && parentGetRouteFor(...args));
	}


	render () {
		const {history} = this;

		return history ?
			this.renderRoutes() :
			this.renderRouter();
	}


	renderRouter () {
		const {...otherProps} = this.props;

		return (
			<BrowserRouter {...otherProps} >
				{this.renderRoutes()}
			</BrowserRouter>
		);
	}


	renderRoutes () {
		const {_router, children} = this.props;

		if (!_router) {
			return React.Children.only(children);
		}

		return (
			<Switch>
				{_router.map((route, index) => this.renderRoute(route, index))}
			</Switch>
		);
	}


	renderRoute (route, index) {
		const {baseroute} = this;
		const {routeProps} = this.props;
		const config = route.getRouteConfig(baseroute, routeProps);

		return (
			<Route key={index} {...config} />
		);
	}
}
