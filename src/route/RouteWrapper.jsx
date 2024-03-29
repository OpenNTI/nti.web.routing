import { useContext } from 'react';
import PropTypes from 'prop-types';

import Frame from '../router/Frame';
import Context from '../router/Context';
import RedirectToPath from '../redirect-to/Path';

import { getParamProps } from './utils';

RouteWrapper.propTypes = {
	routeProps: PropTypes.object,
	componentProps: PropTypes.object,
	routerProps: PropTypes.object, //extra props given to the router that we are passing along
	hasFrame: PropTypes.bool,
	component: PropTypes.any,
	getRedirect: PropTypes.func,
};
export default function RouteWrapper({
	routeProps,
	hasFrame,
	routerProps,
	componentProps,
	component,
	getRedirect,
}) {
	const { frameProps } = useContext(Frame.Context);
	const params = getParamProps(routeProps);

	const props = {
		...routeProps,
		...routerProps,
		...componentProps,
		...params,
		component,
	};

	if (getRedirect) {
		const redirect = getRedirect({
			...props,
			...(hasFrame ? frameProps : {}),
		});

		return redirect == null ? null : <RedirectToPath to={redirect} />;
	}

	if (hasFrame) {
		return <Child {...props} {...frameProps} />;
	}

	return <Child {...props} />;
}

Child.propTypes = {
	component: PropTypes.any,
};

// Establishing this as its own component helps prevent umounting and remounting when parent props change,
// and deferring instantiation avoids premature prop-type checks. (Frame might add required props via clone.)
function Child({ component: Component, ...props }) {
	return (
		<Context>
			<Component {...props} />
		</Context>
	);
}
