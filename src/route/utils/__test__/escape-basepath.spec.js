/* eslint-env jest */

import escape from '../escape-basepath';

describe('escapeBasePath', () => {
	test('escapes +\'s', () => {
		expect(escape('a+b')).toEqual('a\\+b');
	});
});