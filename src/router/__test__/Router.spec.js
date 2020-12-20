/* eslint-env jest */
import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import TestRenderer from 'react-test-renderer';

import BrowserRouter from '../BrowserRouter';
import Router from '../Router';
import RouterConfig from '../RouterConfig';
import {WithTitle} from '../../view/';
import {ContextMerger} from '../utils/context-merger';

function inject (value) {
	return class ContextInjector extends React.Component {
		static childContextTypes = {
			router: PropTypes.any,
		}

		getChildContext () {
			return {
				router: value
			};
		}

		render () {
			return (
				<ContextMerger>{() => this.props.children}</ContextMerger>
			);
		}
	};
}

const mockInterface = (route) => ({
	...route,
	getRouteConfig: () => {}
});


describe('Router', () => {
	describe('.for', () => {
		const routes = [{name: 'route1'}, {name: 'route2'}].map(mockInterface);
		const title = 'Test Router';
		const frame = ({children}) => children;

		const match = {};
		const history = {};
		const location = {};
		const otherProps = {foo: 'bar'};

		const RouterRender = Router.for(routes, {title, frame});

		const {root} = TestRenderer.create((
			<RouterRender
				match={match}
				history={history}
				location={location}
				{...otherProps}
			/>
		));

		const router = root.findByType(Router);

		test('the static Router has correct routes and is passed as the _router prop', () => {
			expect(RouterRender.Router.routes).toEqual(routes);
			expect(router.props['_router']).toEqual(RouterRender.Router);
		});

		test('title prop is the same as in the config', () => {
			expect(router.props.title).toEqual(title);
		});

		test('frame prop is the same as in the config', () => {
			expect(router.props.frame).toEqual(frame);
		});

		test('match prop is the same as the render prop', () => {
			expect(router.props.match).toEqual(match);
		});

		test('_routerProps is the same as other render props', () => {
			expect(router.props['_routerProps'].foo).toEqual('bar');
		});
	});

	test('passes title to WithTitle', () => {
		const title = 'title';
		const renderer = TestRenderer.create(<Router title={title} _router={new RouterConfig([])} />);

		const withTitle = renderer.root.findByType(WithTitle);

		expect(withTitle.props.title).toEqual(title);
	});

	describe('BrowserRouter', () => {
		test('renders BrowserRouter if no history in context', () => {
			const renderer = TestRenderer.create(<Router _router={new RouterConfig([])} />);
			const browserRouter = renderer.root.findByType(BrowserRouter);

			expect(browserRouter).toBeTruthy();
		});

		test('does not render BrowserRouter if history in context', () => {
			const router = {history: {}, route: {}, getRouteFor () {}, createHref () {}};
			const Ctx = inject(router);
			const renderer = TestRenderer.create((
				<Ctx>
					<Router _router={new RouterConfig([])} />
				</Ctx>
			));
			expect(() => renderer.root.findByType(BrowserRouter)).toThrow();
		});
	});
});
