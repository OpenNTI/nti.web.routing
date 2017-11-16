import Path from 'path';

import {defineProtected} from 'nti-commons';

function getSubRoute (routes, args) {
	for (let route of routes) {
		let subRoute = route.getRouteFor && route.getRouteFor(...args);

		if (subRoute) {
			return subRoute;
		}
	}

	return null;
}

export default class RouterConfig {
	/**
	 * Creates a router config
	 * @param  {[RouteConfig]} routes a list of route configs
	 * @return {RouterConfig}           a router config for the given routes
	 */
	constructor (routes) {
		Object.defineProperties(this, {
			...defineProtected({
				routes
			})
		});
	}

	map (fn) {
		return this.routes.map(fn);
	}

	getRouteFor (basePath, ...args) {
		const subRoute = getSubRoute(this.routes, args);

		return subRoute ? Path.join(basePath, subRoute) : null;
	}
}
