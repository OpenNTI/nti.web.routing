/* eslint-env jest */
import createHistory from '../index';

describe('creatHistory', () => {
	test('returns the same instance', () => {
		const history = createHistory();

		expect(createHistory()).toEqual(history);
	});
});
