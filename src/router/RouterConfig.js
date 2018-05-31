import Path from 'path';

import {defineProtected} from '@nti/lib-commons';

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

		if (typeof subRoute === 'function') {
			return subRoute;
		}

		return subRoute ? Path.join(basePath, subRoute) : null;
	}
}
