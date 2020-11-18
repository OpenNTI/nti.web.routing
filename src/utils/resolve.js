import {resolve} from 'path';

import {createPath, parsePath} from 'history';
import {getConfig} from '@nti/web-client';

import {isFullyResolved} from './is-fully-resolved';

const doesEndInSlash = RegExp.prototype.test.bind(/\/$/);

function resolveLocation (base, location) {
	if(location == null) {
		return null;
	}
	const state = location;
	const path = createPath(location);
	const resolvedPath = resolvePath(base, path);
	const resolvedLocation = parsePath(resolvedPath);

	return {...state, ...resolvedLocation};
}

function resolvePath (base, path) {
	if (isFullyResolved(path)) { return path; }

	const resolved = resolve(base, path);

	return !doesEndInSlash(resolved) && doesEndInSlash(path) ? (resolved + '/') : resolved;
}

export function resolveRoute (base, path) {
	const result = typeof path === 'string' ? resolvePath(base, path) : resolveLocation(base, path);
	return getConfig('overrides.routes')[result] || result;
}
