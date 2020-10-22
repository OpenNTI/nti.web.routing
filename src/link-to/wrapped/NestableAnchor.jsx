import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import * as Commons from '@nti/lib-commons';


const AnchorContext = React.createContext(false);

const isModifiedEvent = event => !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

const NestableAnchor = React.forwardRef(
	(
		{
			as,
			innerRef, // deprecated
			navigate,
			onClick,
			beforeNavigation,
			// eslint-disable-next-line react/prop-types
			_maybeNavigateTop,
			...rest
		},
		forwardedRef
	) => {
		const nested = useContext(AnchorContext);
		const { target, download } = rest;

		const props = {
			...rest,
			onClick: event => {
				try {
					if (onClick) {onClick(event);}
				} catch (ex) {
					event.preventDefault();
					throw ex;
				}

				if (
					!event.defaultPrevented &&			// onClick prevented default
					event.button === 0 &&				// ignore everything but left clicks
					(!target || target === '_self') &&	// let browser handle "target=_blank" etc.
					!download &&						// let browser handle downloads
					!isModifiedEvent(event)				// ignore clicks with modifier keys
				) {
					event.preventDefault();
					beforeNavigation?.();
					if (!_maybeNavigateTop?.()) {
						navigate?.();
					}
				}
			}
		};

		props.ref = forwardedRef || innerRef;

		const Anchor = as || (nested ? 'div' : 'a');

		return (
			<AnchorContext.Provider value={true}>
				<Anchor {...props} />
			</AnchorContext.Provider>
		);
	}
);

NestableAnchor.displayName = 'NestableAnchor';

NestableAnchor.propTypes = {
	as: PropTypes.any,
	innerRef: Commons.PropTypes.deprecated,
	navigate: PropTypes.func,
	onClick: PropTypes.func,
	beforeNavigation: PropTypes.func,
};

export default NestableAnchor;
