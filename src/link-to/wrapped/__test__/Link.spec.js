/* eslint-env jest */
import React from 'react';
import PropTypes from 'prop-types';
import { render, fireEvent } from '@testing-library/react';

import getHistory from '../../../history';
import Link from '../Link';

const history = getHistory();

const getClickEvent = () => {
	return { button: 0 };
};

function renderLink(props) {
	class Wrapper extends React.Component {
		static propTypes = {
			children: PropTypes.any,
		};

		static childContextTypes = {
			router: PropTypes.object,
		};

		getChildContext() {
			return {
				router: {
					history,
					location: history.location,
				},
			};
		}

		render() {
			return React.Children.only(this.props.children);
		}
	}

	let link;
	render(
		<Wrapper>
			<Link ref={x => (link = x)} {...props} />
		</Wrapper>
	);

	return link;
}

describe('Link', () => {
	describe('Navigation Tests', () => {
		beforeEach(() => {
			jest.resetAllMocks();

			delete global.location;
			global.location = {
				replace: jest.fn(),
				assign: jest.fn(),
			};

			jest.spyOn(history, 'push').mockImplementation(() => {});
			jest.spyOn(history, 'replace').mockImplementation(() => {});
		});

		test('push fully resolved url', () => {
			const link = renderLink({ to: 'http://www.google.com' });

			fireEvent.click(link, getClickEvent());

			expect(global.location.assign).toHaveBeenCalledWith(
				'http://www.google.com'
			);
			expect(global.location.replace).not.toHaveBeenCalled();

			expect(history.push).not.toHaveBeenCalled();
			expect(history.replace).not.toHaveBeenCalled();
		});

		test('replace fully resolved url', () => {
			const link = renderLink({
				to: 'http://www.google.com',
				replace: true,
			});

			fireEvent.click(link, getClickEvent());

			expect(global.location.assign).not.toHaveBeenCalled();
			expect(global.location.replace).toHaveBeenCalledWith(
				'http://www.google.com'
			);

			expect(history.push).not.toHaveBeenCalled();
			expect(history.replace).not.toHaveBeenCalled();
		});

		test('push relative url', () => {
			const link = renderLink({ to: '/foo/bar' });

			fireEvent.click(link, getClickEvent());

			expect(global.location.assign).not.toHaveBeenCalled();
			expect(global.location.replace).not.toHaveBeenCalled();

			expect(history.push).toHaveBeenCalledWith('/foo/bar');
			expect(history.replace).not.toHaveBeenCalled();
		});

		test('replace relative url', () => {
			const link = renderLink({ to: '/foo/bar', replace: true });

			fireEvent.click(link, getClickEvent());

			expect(global.location.assign).not.toHaveBeenCalled();
			expect(global.location.replace).not.toHaveBeenCalled();

			expect(history.push).not.toHaveBeenCalled();
			expect(history.replace).toHaveBeenCalledWith('/foo/bar');
		});

		test('download', () => {
			const link = renderLink({ to: '/document.pdf', download: true });

			fireEvent.click(link, getClickEvent());

			expect(global.location.assign).not.toHaveBeenCalled();
			expect(global.location.replace).not.toHaveBeenCalled();

			expect(history.push).not.toHaveBeenCalled();
			expect(history.replace).not.toHaveBeenCalled();
		});
	});
});
