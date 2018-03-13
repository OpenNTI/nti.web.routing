import React from 'react';
import PropTypes from 'prop-types';
import { createLocation } from 'history';

const isModifiedEvent = event =>
	!!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

/*
 * The public API for rendering a history-aware <a>.
 */
class Link extends React.Component {
	static propTypes = {
		onClick: PropTypes.func,
		target: PropTypes.string,
		replace: PropTypes.bool,
		to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
		innerRef: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
		component: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
	};

	static defaultProps = {
		replace: false,
		component: 'a'
	};

	static contextTypes = {
		router: PropTypes.shape({
			history: PropTypes.shape({
				push: PropTypes.func.isRequired,
				replace: PropTypes.func.isRequired,
				createHref: PropTypes.func.isRequired
			}).isRequired
		}).isRequired
	};

	handleClick = event => {
		if (this.props.onClick) { this.props.onClick(event); }

		if (
			!event.defaultPrevented && // onClick prevented default
			event.button === 0 && // ignore everything but left clicks
			!this.props.target && // let browser handle 'target=_blank' etc.
			!isModifiedEvent(event) && // ignore clicks with modifier keys
			this.context.router // if we aren't in a router let the browser handle it
		) {
			event.preventDefault();

			const { history } = this.context.router;
			const { replace, to } = this.props;

			if (replace) {
				history.replace(to);
			} else {
				history.push(to);
			}
		}
	};

	render () {
		const {to, innerRef, component:Cmp, ...props } = this.props;

		const { history } = this.context.router;
		const location =
			typeof to === 'string'
				? createLocation(to, null, null, history.location)
				: to;

		const href = history.createHref(location);


		delete props.replace;

		return (
			<Cmp {...props} onClick={this.handleClick} href={href} ref={innerRef} />
		);
	}
}

export default Link;