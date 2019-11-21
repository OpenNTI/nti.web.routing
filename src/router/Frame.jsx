import React from 'react';
import PropTypes from 'prop-types';

const FrameContext = React.createContext({frameProps: {}});

/**
 * The frame is wrapping a react-router Switch component, and the Switch component
 * is not passing extra props through. So we are setting up a context for the frame props
 * that the RouteWrapper can consumer and pass through to the route component.
 */

export default class NTIRouterFrame extends React.Component {
	static Context = FrameContext;
	static Consumer = FrameContext.Consumer;

	static propTypes = {
		children: PropTypes.any
	}


	render () {
		const {children, ...otherProps} = this.props;
		const context = {frameProps: otherProps};

		return (
			<FrameContext.Provider value={context}>
				{children}
			</FrameContext.Provider>
		);
	}
}
