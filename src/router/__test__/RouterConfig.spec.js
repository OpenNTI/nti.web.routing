/* eslint-env jest */
import RouterConfig from '../RouterConfig';

function makeRoute(name, routeFor) {
	const route = {
		name,
		getRouteFor: () => routeFor,
		isDisabled: () => false,
	};

	jest.spyOn(route, 'getRouteFor');

	return route;
}

describe('RouterConfig', () => {
	test('Defines routes', () => {
		const routes = [makeRoute('route1'), makeRoute('route2')];
		const router = new RouterConfig(routes);

		expect(router.routes).toEqual(routes);
	});

	test('Map calls fn for every route', () => {
		const routes = [makeRoute('route1'), makeRoute('route2')];
		const router = new RouterConfig(routes);

		let seen = [];

		router.map(route => seen.push(route));

		expect(seen.length).toEqual(routes.length);

		for (let i = 0; i < seen.length; i++) {
			expect(seen[i]).toEqual(routes[i]);
		}
	});

	describe('getRouteFor', () => {
		test('passes rest of args to the routes', () => {
			const routes = [makeRoute('route1'), makeRoute('route2')];
			const router = new RouterConfig(routes);
			const args = ['arg1', 'arg2', 'arg3'];

			router.getRouteFor('/base/path/', ...args);

			for (let route of routes) {
				expect(route.getRouteFor).toHaveBeenCalledWith(...args);
			}
		});

		test('stops looking once a route returns', () => {
			const routes = [
				makeRoute('route1'),
				makeRoute('route2', 'route'),
				makeRoute('route3'),
			];
			const router = new RouterConfig(routes);

			router.getRouteFor('base/path/');

			expect(routes[0].getRouteFor).toHaveBeenCalled();
			expect(routes[1].getRouteFor).toHaveBeenCalled();
			expect(routes[2].getRouteFor).not.toHaveBeenCalled();
		});

		test('returns null if no route', () => {
			const routes = [makeRoute('route1'), makeRoute('route2')];
			const router = new RouterConfig(routes);

			expect(router.getRouteFor('/base/path/')).toBeNull();
		});

		test('Joins the basepath to the route', () => {
			const routes = [makeRoute('route1', 'route')];
			const router = new RouterConfig(routes);

			expect(router.getRouteFor('/base/path/')).toEqual(
				'/base/path/route'
			);
		});
	});
});
