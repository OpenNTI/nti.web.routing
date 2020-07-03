import React from 'react';
import PropTypes from 'prop-types';
import {
	Route,
	Switch
} from 'react-router-dom';
import {PropTypes as PT} from '@nti/lib-commons';

import * as LinkTo from '../link-to';
import {WithTitle} from '../view';
import getHistory from '../history';

import {getFrameProps} from './utils';
import Context from './Context';
import BrowserRouter from './BrowserRouter';
import RouterConfig from './RouterConfig';
import FrameWrapper from './Frame';
import RouteForProvider from './RouteForProvider';

let globalGetRouteFor = null;

export default class Router extends React.Component {
	static RouteForProvider = RouteForProvider;
	static useRouter = Context.useRouter;
	static setGlobalGetRouteFor (getRouteFor) {
		globalGetRouteFor = getRouteFor;
	}

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

		return class InlineRouter extends React.Component {
			static Router = router
			static propTypes = {
				match: PropTypes.object,//if the router is being used as a component for another route, it will be given a match that we need to use
				history: PropTypes.object,
				location: PropTypes.object
			}


			render () {
				const {match, history, location, ...otherProps} = this.props;

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
		};
	}

	static propTypes = {
		_router: PropTypes.object.isRequired,
		_routerProps: PropTypes.object,

		title: PropTypes.string,
		frame: PT.component,

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
			getRouteFor: PropTypes.func,
			routeTo: PropTypes.shape({
				name: PropTypes.func,
				object: PropTypes.func,
				path: PropTypes.func
			})
		})
	}

	getChildContext () {
		//TODO: this needs to be updated to use the new react context
		return {
			router: {
				...this.context.router,
				getRouteFor: (...args) => this.getRouteFor(...args),
				baseroute: this.baseroute,
				routeTo: {
					name: (...args) => LinkTo.Name.routeTo(this, ...args),
					object:  (...args) => LinkTo.Object.routeTo(this, ...args),
					path: (...args) => LinkTo.Path.routeTo(this, ...args)
				}
			}
		};
	}

	get router () {
		return this.context.router || {};
	}


	get history () {
		return this.providedHistory || getHistory();
	}

	get providedHistory () {
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

		return route || (parentGetRouteFor && parentGetRouteFor(...args)) || (globalGetRouteFor && globalGetRouteFor(...args));
	}


	render () {
		const {title} = this.props;
		const {providedHistory} = this;

		return (
			<WithTitle title={title}>
				{
					providedHistory ?
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
		const {_router, _routerProps, children, frame: Frame} = this.props;

		if (React.Children.count(children) > 0) {
			return React.Children.only(children);
		}

		const routes = (
			<Switch>
				{_router.map((route, index) => this.renderRoute(route, index))}
			</Switch>
		);

		if (!Frame) { return routes; }

		return (
			<Frame {...getFrameProps(this.props)} {..._routerProps}>
				<FrameWrapper>
					{routes}
				</FrameWrapper>
			</Frame>
		);
	}


	renderRoute (route, index) {
		const {baseroute} = this;
		const {_routerProps, frame} = this.props;
		const config = route.getRouteConfig(baseroute, !!frame, _routerProps);

		return (
			<Route key={index} {...config} />
		);
	}
}
