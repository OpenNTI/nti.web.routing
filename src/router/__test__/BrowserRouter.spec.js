/* eslint-env jest */
import { Router } from 'react-router-dom';
import TestRenderer from 'react-test-renderer';

import { BrowserRouter } from '../BrowserRouter';
import getHistory from '../../history';

const history = getHistory();

describe('BrowserRouter', () => {
	test('passes the history instance to the router', () => {
		const { root } = TestRenderer.create(<BrowserRouter />);
		const router = root.findByType(Router);

		expect(router.props.history).toEqual(history);
	});
});
