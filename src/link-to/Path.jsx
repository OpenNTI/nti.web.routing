import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Logger from '@nti/util-logger';

import { isExternal, resolveRoute } from '../utils';

import { Link, NavLink } from './wrapped';

const Path = styled.a`
	a& {
		text-decoration: none;
		outline: none;
		color: var(--text-color-nav-link, inherit);

		&:focus {
			outline: none;
		}
	}
`;

const logger = Logger.get('nti-web-routing:link-to:path');

export default class PathLink extends React.Component {
	static routeTo(router, path) {
		return Link.routeTo(router, path);
	}

	static propTypes = {
		as: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object,
			PropTypes.func,
		]),
		to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		className: PropTypes.string,
		activeClassName: PropTypes.string,
		activeStyle: PropTypes.object,

		onClick: PropTypes.func,
		onMouseEnter: PropTypes.func,
		onMouseLeave: PropTypes.func,
	};

	static contextTypes = {
		router: PropTypes.shape({
			baseroute: PropTypes.string,
		}),
		linkTo: PropTypes.shape({
			depth: PropTypes.number,
			navigateToSubLink: PropTypes.func,
			activateSubLink: PropTypes.func,
			deactivateSubLink: PropTypes.func,
		}),
	};

	static childContextTypes = {
		linkTo: PropTypes.shape({
			depth: PropTypes.number,
			activateSubLin: PropTypes.func,
			deactivateSubLink: PropTypes.func,
		}),
	};

	ref = React.createRef();
	state = {
		toOverride: null,
	};

	get to() {
		return this.state.toOverride || this.props.to;
	}

	get parentLink() {
		return this.context.linkTo || null;
	}

	get router() {
		return this.context.router || {};
	}

	get baseroute() {
		const { router } = this;

		return router.baseroute || '';
	}

	attachAnchor = x => (this.anchor = x);

	getChildContext() {
		const { parentLink } = this;

		if (parentLink?.depth > 1) {
			logger.debug(
				'Nested Links more than one level deep might have some weird behaviors'
			);
		}

		return {
			linkTo: {
				depth: parentLink?.depth + 1 || 0,
				activateSubLink: this.activateSubLink,
				deactivateSubLink: this.deactivateSubLink,
				isActiveSubLink: this.isActiveSubLink,
			},
		};
	}

	navigateToSubLink = link => {
		this.setState({
			toOverride: link,
		});
	};

	isActiveSubLink = link => {
		return link && link === this.state.toOverride;
	};

	activateSubLink = link => {
		this.setState({
			toOverride: link,
		});
	};

	deactivateSubLink = link => {
		if (this.isActiveSubLink(link)) {
			this.setState({
				toOverride: null,
			});
		}
	};

	componentWillUnmount() {
		const { parentLink, to } = this;

		if (parentLink?.isActiveSubLink?.(to)) {
			parentLink.deactivateSubLink(to);
		}
	}

	onMouseEnter = e => {
		const { parentLink, to } = this;
		const { onMouseEnter } = this.props;

		parentLink?.activateSubLink?.(to);

		if (onMouseEnter) {
			onMouseEnter(e);
		}
	};

	onMouseLeave = e => {
		const { parentLink, to } = this;
		const { onMouseLeave } = this.props;

		parentLink?.deactivateSubLink?.(to);

		if (onMouseLeave) {
			onMouseLeave(e);
		}
	};

	getDOMNode() {
		const { current } = this.ref;
		return current?.getDOMNode?.() || current;
	}

	render() {
		const {
			as: Cmp = Path,
			className,
			activeClassName,
			activeStyle,
			...otherProps
		} = this.props;
		const path = resolveRoute(this.baseroute, this.to);

		const props = {
			...otherProps,
			ref: this.ref,
			className: cx('nti-link-to-path', className),
		};

		if (!this.context.router) {
			return <div {...props} />;
		}

		if (isExternal(path, this.baseroute)) {
			delete props.to;
			props.href = path;
		} else {
			props.to = path;
		}

		if (this.parentLink) {
			props.onMouseEnter = this.onMouseEnter;
			props.onMouseLeave = this.onMouseLeave;
			props.component = 'span';
		}

		const active =
			activeClassName || activeStyle
				? { activeClassName, activeStyle }
				: null;

		return <Cmp as={active ? NavLink : Link} {...props} {...active} />;
	}
}
