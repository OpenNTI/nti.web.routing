/* eslint-env jest */
import React from 'react';
import {shallow, mount} from 'enzyme';

import BrowserRouter from '../BrowserRouter';
import Router from '../Router';
import RouterConfig from '../RouterConfig';
import {WithTitle} from '../../view/';

describe('Router', () => {
	describe('.for', () => {
		const routes = [{name: 'route1'}, {name: 'route2'}];
		const title = 'Test Router';
		const frame = () => {};

		const match = {};
		const history = {};
		const location = {};
		const otherProps = {foo: 'bar'};

		let RouterRender;
		let RouterCmp;

		beforeEach(() => {
			RouterRender = Router.for(routes, {title, frame});

			RouterCmp = shallow((
				<RouterRender
					match={match}
					history={history}
					location={location}
					{...otherProps}
				/>
			));
		});

		test('the static Router has correct routes and is passed as the _router prop', () => {
			expect(RouterRender.Router.routes).toEqual(routes);
			expect(RouterCmp.prop('_router')).toEqual(RouterRender.Router);
		});

		test('title prop is the same as in the config', () => {
			expect(RouterCmp.prop('title')).toEqual(title);
		});

		test('frame prop is the same as in the config', () => {
			expect(RouterCmp.prop('frame')).toEqual(frame);
		});

		test('match prop is the same as the render prop', () => {
			expect(RouterCmp.prop('match')).toEqual(match);
		});

		test('_routerProps is the same as other render props', () => {
			expect(RouterCmp.prop('_routerProps').foo).toEqual('bar');
		});
	});

	test('passes title to WithTitle', () => {
		const title = 'title';
		const routerCmp = mount(<Router title={title} _router={new RouterConfig([])} />);

		const withTitle = routerCmp.find(WithTitle);

		expect(withTitle.prop('title')).toEqual(title);
	});

	describe('BrowserRouter', () => {
		test('renders BrowserRouter if no history in context', () => {
			const routerCmp = mount(<Router _router={new RouterConfig([])} />);
			const browserRouter = routerCmp.find(BrowserRouter);

			expect(browserRouter.exists()).toBeTruthy();
		});

		test('does not render BrowserRouter if history in context', () => {
			const routerCmp = mount(<Router _router={new RouterConfig([])} />, {
				context: {router: {history: {}, route: {}, createHref () {}}}
			});
			const browserRouter = routerCmp.find(BrowserRouter);

			expect(browserRouter.exists()).toBeFalsy();
		});
	});
});
