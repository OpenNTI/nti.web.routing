/* eslint-env jest */
import isFullyResolved from '../is-fully-resolved.js';

describe('isFullyResolved', () => {
	test('Has Protocol', () => {
		expect(isFullyResolved('http://www.google.com')).toBeTruthy();
		expect(isFullyResolved('https://www.google.com')).toBeTruthy();
		expect(isFullyResolved('ftp://www.google.com')).toBeTruthy();
	});

	test('Protocol-less', () => {
		expect(isFullyResolved('//www.google.com')).toBeTruthy();
	});

	test('Not fully resolved', () => {
		expect(isFullyResolved('/foo/bar')).toBeFalsy();
		expect(isFullyResolved('http/bar')).toBeFalsy();
		expect(isFullyResolved('foo/bar.html')).toBeFalsy();
	});
});
