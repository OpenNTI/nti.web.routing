import {resolve} from 'path';

import {createPath, parsePath} from 'history';

function resolveLocation (base, location) {
	const state = location;
	const path = createPath(location);
	const resolvedPath = resolve(base, path);
	const resolvedLocation = parsePath(resolvedPath);

	return {...resolvedLocation, state};
}

function resolvePath (base, path) {
	return resolve(base, path);
}

export default function resolveRoute (base, path) {
	return typeof path === 'string' ? resolvePath(base, path) : resolveLocation(base, path);
}
