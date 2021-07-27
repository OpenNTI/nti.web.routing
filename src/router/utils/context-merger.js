import React from 'react';
import PropTypes from 'prop-types';
import { __RouterContext as RouterContext } from 'react-router';

ContextMerger.contextTypes = {
	router: PropTypes.shape({
		disabled: PropTypes.bool,
	}),
};

export function ContextMerger(props, legacyContext) {
	const context = React.useContext(RouterContext);
	const useThisContext = { ...legacyContext?.router, ...context };
	return (
		<RouterContext.Provider value={useThisContext}>
			{props.children(useThisContext)}
		</RouterContext.Provider>
	);
}
