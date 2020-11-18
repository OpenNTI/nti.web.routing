export function isExternal (url, basepath) {
	const {defaultView: {location: {origin}}} = document;
	try {
		url = new URL(url);
		return url.origin !== origin || !url.pathname.startsWith(basepath);
	} catch {
		return false;
	}
}
