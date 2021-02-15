import { isFullyQualified } from '../../utils';

function doReplace(history, href) {
	if (isFullyQualified(href)) {
		global.location.replace(href);
	} else {
		history.replace(href);
	}
}

function doPush(history, href) {
	if (isFullyQualified(href)) {
		global.location.assign(href);
	} else {
		history.push(href);
	}
}

export default function routeTo(router, path) {
	if (path.target === '_blank' || path.download) {
		return window.open(path.href);
	}

	const isHref = typeof path === 'string';
	const { history } = router;

	if (!isHref && path.replace) {
		return doReplace(history, path.href);
	} else {
		return doPush(history, path.href || path);
	}
}

export function topLevelNavigate(href, replace) {
	const { location } = global;

	if (isFullyQualified(href)) {
		const method = replace ? location.replace : location.assign;

		method.call(location, href);
		return true;
	}
}
