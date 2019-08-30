//Since we are patching a function from a library, let it handle resolve-pathname
import resolvePathname from 'resolve-pathname'; //eslint-disable-line
import { parsePath } from 'history';

export default function createLocation (path, state, key, currentLocation) {
	let location;
	if (typeof path === 'string') {
		// Two-arg form: push(path, state)
		location = parsePath(path);
		location.state = state;
	} else {
		// One-arg form: push(location)
		location = { ...path };

		if (location.pathname === undefined) { location.pathname = ''; }

		if (location.search) {
			if (location.search.charAt(0) !== '?') {
				location.search = '?' + location.search;
			}
		} else {
			location.search = '';
		}

		if (location.hash) {
			if (location.hash.charAt(0) !== '#') { location.hash = '#' + location.hash; }
		} else {
			location.hash = '';
		}

		if (state !== undefined && location.state === undefined) {
			location.state = state;
		}
	}

	if (key) { location.key = key; }

	if (currentLocation) {
		// Resolve incomplete/relative pathname relative to current location.
		if (!location.pathname) {
			location.pathname = currentLocation.pathname;
		} else if (location.pathname.charAt(0) !== '/') {
			location.pathname = resolvePathname(
				location.pathname,
				currentLocation.pathname
			);
		}
	} else {
		// When there is no prior location and pathname is empty, set it to /
		if (!location.pathname) {
			location.pathname = '/';
		}
	}

	return location;
}