import React from 'react';
import PropTypes from 'prop-types';
import { createLocation } from 'history';

import {isFullyResolved} from '../utils';

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
		download: PropTypes.bool,
		to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
		innerRef: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
		component: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
		beforeNavigation: PropTypes.func
	};

	static defaultProps = {
		replace: false
	};

	static contextTypes = {
		router: PropTypes.shape({
			disabled: PropTypes.bool,
			history: PropTypes.shape({
				push: PropTypes.func.isRequired,
				replace: PropTypes.func.isRequired,
				createHref: PropTypes.func.isRequired
			})
		}).isRequired
	};

	handleClick = event => {
		if (this.props.onClick) { this.props.onClick(event); }

		const { history } = this.context.router;
		const { replace, to, beforeNavigation } = this.props;

		const doReplace = (href) => isFullyResolved(href) ? global.location.replace(href) : history.replace(href);
		const doPush = (href) => isFullyResolved(href) ? global.location.assign(href) : history.push(href);

		if (
			!event.defaultPrevented && // onClick prevented default
			event.button === 0 && // ignore everything but left clicks
			!this.props.target && // let browser handle 'target=_blank' etc.
			!this.props.download && // let the browser handle downloads
			!isModifiedEvent(event) && // ignore clicks with modifier keys
			this.context.router // if we aren't in a router let the browser handle it
		) {
			event.preventDefault();

			if (beforeNavigation) {
				beforeNavigation();
			}

			if (replace) {
				doReplace(to);
			} else {
				doPush(to);
			}
		}
	};

	render () {
		const {to, innerRef, component, ...props } = this.props;

		delete props.replace;

		if (this.context.router.disabled) {
			const Cmp = component || 'div';

			return (<Cmp {...props} />);
		}

		const Cmp = component || 'a';

		if (isFullyResolved(to)) {
			return (<Cmp {...props} onClick={this.handleClick} href={to} ref={innerRef} />);
		}

		const { history } = this.context.router;
		const location =
			typeof to === 'string'
				? createLocation(to, null, null, history.location)
				: to;

		const href = history.createHref(location);


		return (
			<Cmp {...props} onClick={this.handleClick} href={href} ref={innerRef} />
		);
	}
}

export default Link;
