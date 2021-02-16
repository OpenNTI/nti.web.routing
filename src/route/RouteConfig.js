import { join } from 'path';

import React from 'react';
import { defineProtected } from '@nti/lib-commons';

import RouteWrapper from './RouteWrapper';
import { getPartInfo, escapeBasepath } from './utils';

const HAS_PARAMS = /:/g;

export default class RouteConfig {
	/**
	 * Create a route config
	 *
	 * See: https://reacttraining.com/react-router/web/api/Route for an explanation of the config
	 *
	 * @param  {Object} config              the config for the route
	 * @param {string|string[]} config.path the path(s) to match for the route
	 * @param {boolean} config.exact        the path has to match the location exactly
	 * @param {boolean} config.strict       the path has to match the location strictly
	 * @param {Object} config.component     the component to render, if the component statically defines Router  it will be used for config.Router
	 * @param {Object} config.router        a sub router
	 * @param {string} config.name          name to find the route by
	 * @param {Object} config.props         extra props to pass to the component for the route
	 * @param {Function} config.buildPathFor build the url
	 * @param {Function} config.getRouteFor a method that takes an object and returns a route if it can handle showing it
	 * @returns {RouteConfig}                a RouteConfig for the given config
	 */
	constructor(config) {
		Object.defineProperties(this, {
			...defineProtected({
				config,
			}),
		});

		if (!config.component) {
			throw new Error('Cannot define a route without a component');
		}

		if (!Array.isArray(config.path)) {
			config.path = [config.path];
		}

		config.path = config.path.filter(Boolean);

		if (!config.path.length) {
			throw new Error('Cannot define a route without a path');
		}
	}

	getRouteConfig(basepath, hasFrame, routerProps) {
		const { path, exact, strict, component, props: componentProps } =
			this.config || {};

		const config = {
			path: path.map(p => join(escapeBasepath(basepath), p || '')),
			exact,
			strict,
		};

		//Potential memory leak creating a function everytime, but I can't think of a way around it...
		config.render = function InlineRouterWrapper(props) {
			return React.createElement(RouteWrapper, {
				routeProps: props,
				component,
				hasFrame,
				componentProps,
				routerProps,
			});
		};

		return config;
	}

	hasPathParams() {
		return HAS_PARAMS.test(this.config.path);
	}

	getSubRouter() {
		return this.config.component.Router || this.config.router;
	}

	buildPathFor(params, ...args) {
		const { config } = this;

		if (config && config.buildPathFor) {
			return config.buildPathFor(params, ...args);
		}

		//if there are not params there's nothing to build
		if (!this.hasPathParams()) {
			return {
				path: config.path[0],
				canBeBase: true,
			};
		}

		if (!params || typeof params !== 'object') {
			params = {};
		}

		const parts = config.path[0].split('/');
		let path = '';
		let canBeBase = true;

		for (let i = 0; i < parts.length; i++) {
			let info = getPartInfo(parts[i]);
			let data = params[info.name];

			if (!info.isParam) {
				path = join(path, info.raw);
			} else if (data !== undefined) {
				path = join(path, data);
				//if the param is not required and we are the last one, we have a valid path, it just can't be extended any.
			} else if (!info.isRequired && i === parts.length - 1) {
				canBeBase = false;
			} else {
				path = null;
				canBeBase = false;
				break;
			}
		}

		return {
			path,
			canBeBase,
		};
	}

	getRouteFor(obj, ...args) {
		return typeof obj === 'string'
			? this.getRouteForName(obj, args)
			: this.getRouteForObject(obj, args);
	}

	getRouteForName(name, args) {
		const { config } = this;
		const { path, canBeBase } = this.buildPathFor(...args);

		//if this route has the same name use it
		if (name === config.name && path) {
			return path;
		}

		//else if we have a subRouter and our path doesn't have any params we can check the subRouter for the
		//named route
		const subRouter = this.getSubRouter();
		const subRoute =
			canBeBase && subRouter ? subRouter.getRouteFor(path, name) : null;

		return subRoute || null;
	}

	getRouteForObject(obj, args) {
		const { config } = this;
		//if this route can handle the obj return that object
		const route = config.getRouteFor
			? config.getRouteFor(obj, ...args)
			: null;

		if (route) {
			return route;
		}

		//else if we have a subRouter and our path doesn't have any params we can build the subRoute if
		//we have a subRouter
		const subRouter = this.getSubRouter();
		const subRoute =
			!this.hasPathParams() && subRouter
				? subRouter.getRouteFor(config.path, obj, ...args)
				: null;

		return subRoute || null;
	}
}
