// import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router';

function doesMatch(hash, match) {
	if (typeof match === 'string') {
		return hash === match;
	}
	if (typeof match === 'function') {
		return match(hash);
	}
}

HashRoute.propTypes = {
	matches: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
	render: PropTypes.func.isRequired,
};

HashRoute.contextTypes = {
	router: PropTypes.shape({
		route: PropTypes.shape({
			location: PropTypes.shape({
				hash: PropTypes.string,
			}),
		}),
	}),
};

export default function HashRoute({ matches, render }, { router }) {
	const { hash, pathname } = useLocation();

	const setHash = () => void router?.routeTo.path(pathname);

	return doesMatch(hash, matches) ? render(hash, setHash) : null;
}
