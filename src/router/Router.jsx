import React from 'react';
import PropTypes from 'prop-types';
import {
	Route,
	Switch
} from 'react-router-dom';

import {WithTitle} from '../view';

import BrowserRouter from './BrowserRouter';
import RouterConfig from './RouterConfig';

export default class Router extends React.Component {
	/**
	 * Create a Router component for a given set of routes
	 * @param {Array} routes    the list of routes to include in the router
	 * @param {Object} config   different configurations to control how the router works
	 * @param {Component} config.frame  the component to render as a frame around the routes
	 * @param {String} config.title     a title to use when the route is active
	 * @return {Router}          Router component for given routes and config
	 */
	static for (routes, config) {
		const router = new RouterConfig(routes);
		const {frame, title} = config || {};

		InlineRouter.Router = router;
		InlineRouter.propTypes = {
			match: PropTypes.object,//if the router is being used as a component for another route, it will be given a match that we need to use
			history: PropTypes.object,
			location: PropTypes.object
		};
		function InlineRouter (props) {
			const {match, history, location, ...otherProps} = props;

			return (
				<Router
					_router={router}
					_routerProps={otherProps}
					frame={frame}
					title={title}
					match={match}
					history={history}
					location={location}
				/>
			);
		}

		return InlineRouter;
	}

	static propTypes = {
		_router: PropTypes.object.isRequired,
		_routerProps: PropTypes.object,

		title: PropTypes.string,
		frame: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.func
		]),

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
		const {title} = this.props;
		const {history} = this;

		return (
			<WithTitle title={title}>
				{
					history ?
						this.renderRoutes() :
						this.renderRouter()
				}
			</WithTitle>
		);
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

		if (React.Children.count(children) > 0) {
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
		const {frame, _routerProps} = this.props;
		const config = route.getRouteConfig(baseroute, frame, _routerProps);

		return (
			<Route key={index} {...config} />
		);
	}
}
