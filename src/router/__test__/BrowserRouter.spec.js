/* eslint-env jest */
import React from 'react';
import {Router} from 'react-router-dom';
import {mount} from 'enzyme';

import BrowserRouter from '../BrowserRouter';
import getHistory from '../../history';

const history = getHistory();

describe('BrowserRouter', () => {
	test('passes the history instance to the router', () => {
		const browserRouter = mount((<BrowserRouter />));
		const router = browserRouter.find(Router);

		expect(router.prop('history')).toEqual(history);
	});
});
