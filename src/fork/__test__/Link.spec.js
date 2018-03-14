/* eslint-env jest */
import React from 'react';
import PropTypes from 'prop-types';
import {mount} from 'enzyme';

import getHistory from '../../history';
import Link from '../Link';

const history = getHistory();

const getClickEvent = () => {return {button: 0}; };

function renderLink (props) {
	class Wrapper extends React.Component {
		static propTypes = {
			children: PropTypes.any
		}

		static childContextTypes = {
			router: PropTypes.object
		}


		getChildContext () {
			return {
				router: {
					history
				}
			};
		}

		render () {
			return React.Children.only(this.props.children);
		}
	}

	const render = mount((<Wrapper><Link {...props} /></Wrapper>));

	return render.find(Link);
}

describe('Link', () => {
	describe('Navigation Tests', () => {
		beforeEach(() => {
			jest.resetAllMocks();

			global.location = {
				replace: () => {},
				assign: () => {}
			};

			jest.spyOn(global.location, 'assign');
			jest.spyOn(global.location, 'replace');
			jest.spyOn(history, 'push').mockImplementation(() => {});
			jest.spyOn(history, 'replace').mockImplementation(() => {});
		});

		test('push fully resolved url', () => {
			const link = renderLink({to: 'http://www.google.com'});

			link.simulate('click', getClickEvent());

			expect(global.location.assign).toHaveBeenCalledWith('http://www.google.com');
			expect(global.location.replace).not.toHaveBeenCalled();

			expect(history.push).not.toHaveBeenCalled();
			expect(history.replace).not.toHaveBeenCalled();
		});

		test('replace fully resolved url', () => {
			const link = renderLink({to: 'http://www.google.com', replace: true});

			link.simulate('click', getClickEvent());

			expect(global.location.assign).not.toHaveBeenCalled();
			expect(global.location.replace).toHaveBeenCalledWith('http://www.google.com');

			expect(history.push).not.toHaveBeenCalled();
			expect(history.replace).not.toHaveBeenCalled();
		});

		test('push relative url', () => {
			const link = renderLink({to: '/foo/bar'});

			link.simulate('click', getClickEvent());

			expect(global.location.assign).not.toHaveBeenCalled();
			expect(global.location.replace).not.toHaveBeenCalled();

			expect(history.push).toHaveBeenCalledWith('/foo/bar');
			expect(history.replace).not.toHaveBeenCalled();
		});

		test('replace relative url', () => {
			const link = renderLink({to: '/foo/bar', replace: true});

			link.simulate('click', getClickEvent());

			expect(global.location.assign).not.toHaveBeenCalled();
			expect(global.location.replace).not.toHaveBeenCalled();

			expect(history.push).not.toHaveBeenCalled();
			expect(history.replace).toHaveBeenCalledWith('/foo/bar');
		});
	});
});
