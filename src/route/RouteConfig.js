import Path from 'path';

import {defineProtected} from 'nti-commons';

const HAS_PARAMS = /:/g;

export default class RouteConfig {
	/**
	 * Create a route config
	 *
	 * See: https://reacttraining.com/react-router/web/api/Route for an explanation of the config
	 *
	 * @param  {Object} config the config for the route
	 * @param {String} config.path the path to match for the route
	 * @param {Boolean} config.exact the path has to match the location exactly
	 * @param {Boolean} config.strict the path has to match the location strictly
	 * @param {Object} config.component the component to render, if the component statically defines Router  it will be used for config.Router
	 * @param {Object} config.router a sub router
	 * @param {String} config.name name to find the route by
	 * @param {Function} config.getRouteFor a method that takes an object and returns a route if it can handle showing it
	 * @return {[type]}        [description]
	 */
	constructor (config) {
		Object.defineProperties(this, {
			...defineProtected({
				config
			})
		});

		if (!config.component) { throw new Error('Cannot define a route without a component'); }
		if (config.name && this.hasPathParams()) { throw new Error('Named route cannot have params'); }
	}

	getRouteConfig (basepath) {
		const {path, exact, strict, component} = this.config || {};

		return {
			path: Path.join(basepath, path || ''),
			exact,
			strict,
			component
		};
	}


	hasPathParams () {
		return HAS_PARAMS.test(this.config.path);
	}


	getSubRouter () {
		return this.config.component.Router || this.config.router;
	}


	getRouteFor (obj) {
		return typeof obj === 'string' ? this.getRouteForName(obj) : this.getRouteForObject(obj);
	}


	getRouteForName (name) {
		const {config} = this;
		//if this route has the same name use it
		const route = config.name === name ? config.path : null;

		if (route) { return route; }

		//else if we have a subRouter and our path doesn't have any params we can check the subRouter for the
		//named route
		const subRouter = this.getSubRouter();
		const subRoute = !this.hasPathParams() && subRouter ? subRouter.getRouteFor(config.path, name) : null;

		return subRoute || null;
	}


	getRouteForObject (obj) {
		const {config} = this;
		//if this route can handle the obj return that object
		const route = config.getRouteFor ? config.getRouteFor(obj) : null;

		if (route) { return route; }

		//else if we have a subRouter and our path doesn't have any params we can build the subRoute if
		//we have a subRouter
		const subRouter = this.getSubRouter();
		const subRoute = !this.hasPathParams() && subRouter ? subRouter.getRouteFor(config.path, obj) : null;

		return subRoute || null;
	}

}
