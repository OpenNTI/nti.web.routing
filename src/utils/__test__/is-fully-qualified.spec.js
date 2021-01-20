/* eslint-env jest */
import {isFullyQualified} from '../is-fully-qualified.js';

describe('isFullyQualified', () => {
	test('Has Protocol', () => {
		expect(isFullyQualified('http://www.google.com')).toBeTruthy();
		expect(isFullyQualified('https://www.google.com')).toBeTruthy();
		expect(isFullyQualified('ftp://www.google.com')).toBeTruthy();
	});

	test('Protocol-less', () => {
		expect(isFullyQualified('//www.google.com')).toBeTruthy();
	});

	test('Not fully resolved', () => {
		expect(isFullyQualified('/foo/bar')).toBeFalsy();
		expect(isFullyQualified('http/bar')).toBeFalsy();
		expect(isFullyQualified('foo/bar.html')).toBeFalsy();
	});
});
