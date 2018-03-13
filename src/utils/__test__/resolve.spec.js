/* eslint-env jest */
import resolve from '../resolve';

describe('resolve', () => {
	test('path is a string', () => {
		expect(resolve('/base/path/route', './route-1')).toEqual('/base/path/route/route-1');
	});

	test('path is a location object', () => {
		const location = {pathname: './route-1', search: '?foo=bar', hash: '#hash', state: {bar: 'foo'}};

		expect(resolve('/base/path/route', location)).toEqual({
			...location,
			pathname: '/base/path/route/route-1'
		});
	});

	test('path is fully resolved', () => {
		expect(resolve('/base/path/route', 'http://www.google.com')).toEqual('http://www.google.com');
	});
});
