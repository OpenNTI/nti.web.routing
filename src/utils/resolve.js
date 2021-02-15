import { resolve } from 'path';

import { createPath, parsePath } from 'history';
import { getConfig } from '@nti/web-client';

import { isFullyQualified } from './is-fully-qualified';

const doesEndInSlash = RegExp.prototype.test.bind(/\/$/);

function resolveLocation(base, location) {
	if (location == null) {
		return null;
	}
	const state = location;
	const path = createPath(location);
	const resolvedPath = resolvePath(base, path);
	const resolvedLocation = parsePath(resolvedPath);

	return { ...state, ...resolvedLocation };
}

function resolvePath(base, path) {
	if (isFullyQualified(path)) {
		return path;
	}

	const resolved = resolve(base, path);

	return !doesEndInSlash(resolved) && doesEndInSlash(path)
		? resolved + '/'
		: resolved;
}

export function resolveRoute(base, path) {
	const result =
		typeof path === 'string'
			? resolvePath(base, path)
			: resolveLocation(base, path);
	return getConfig('overrides.routes')[result] || result;
}
