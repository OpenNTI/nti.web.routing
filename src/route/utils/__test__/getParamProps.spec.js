/* eslint-env jest */
import getParamProps from '../get-param-props';

const isEmptyObject = x => typeof x === 'object' && Object.keys(x).length === 0;

describe('getParamProps', () => {
	test('returns an object if not given a route', () => {
		const props = getParamProps();

		expect(isEmptyObject(props)).toBeTruthy();
	});

	test('returns an object if given a route without a match', () => {
		const props = getParamProps({ location: 'location' });

		expect(isEmptyObject(props)).toBeTruthy();
	});

	test('returns an object if given a route with a match without params', () => {
		const props = getParamProps({
			location: 'location',
			match: { route: 'path' },
		});

		expect(isEmptyObject(props)).toBeTruthy();
	});

	test('returns the params if given a route with a match with params', () => {
		const params = { param: 'foobar' };
		const props = getParamProps({
			location: 'location',
			match: { route: 'path', params },
		});

		expect(props).toEqual(params);
	});
});
