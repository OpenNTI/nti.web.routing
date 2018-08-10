import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Logger from '@nti/util-logger';

import {resolve} from '../utils';
import Link from '../fork/Link';
import NavLink from '../fork/NavLink';

const logger = Logger.get('nti-web-routing:link-to:path');

export default class PathLink extends React.Component {
	static routeTo (router, path) {
		return Link.routeTo(router, path);
	}

	static propTypes = {
		to: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),
		className: PropTypes.string,
		activeClassName: PropTypes.string,
		activeStyle: PropTypes.object,

		onClick: PropTypes.func,
		onMouseEnter: PropTypes.func,
		onMouseLeave: PropTypes.func
	}

	static contextTypes = {
		router: PropTypes.shape({
			baseroute: PropTypes.string
		}),
		linkTo: PropTypes.shape({
			depth: PropTypes.number,
			navigateToSubLink: PropTypes.func,
			activateSubLink: PropTypes.func,
			deactivateSubLink: PropTypes.func
		})
	}

	static childContextTypes = {
		linkTo: PropTypes.shape({
			depth: PropTypes.number,
			activateSubLin: PropTypes.func,
			deactivateSubLink: PropTypes.func
		})
	}


	state = {
		toOverride: null
	}

	get to () {
		return this.state.toOverride || this.props.to;
	}


	get parentLink () {
		return this.context.linkTo || null;
	}

	get router () {
		return this.context.router || {};
	}


	get baseroute () {
		const {router} = this;

		return router.baseroute || '';
	}


	attachAnchor = x => this.anchor = x


	getChildContext () {
		const {parentLink} = this;

		if (parentLink && parentLink.depth > 0) {
			logger.warn('Nested Links more than one level deep might have some weird behaviors');
		}

		return {
			linkTo: {
				depth: parentLink ? parentLink.depth + 1 : 0,
				activateSubLink: this.activateSubLink,
				deactivateSubLink: this.deactivateSubLink,
				isActiveSubLink: this.isActiveSubLink
			}
		};
	}


	navigateToSubLink = (link) => {
		this.setState({
			toOverride: link
		});
	}


	isActiveSubLink = (link) => {
		return link && link === this.state.toOverride;
	}


	activateSubLink = (link) => {
		this.setState({
			toOverride: link
		});
	}


	deactivateSubLink = (link) => {
		if (!this.isActiveSubLink(link)) {
			logger.warn('Deactivating a link that is not active...');
		} else {
			this.setState({
				toOverride: null
			});
		}
	}


	componentWillUnmount () {
		const {parentLink, to} = this;

		if (parentLink && parentLink.isActiveSubLink && parentLink.isActiveSubLink(to)) {
			parentLink.deactivateSubLink(to);
		}
	}


	onMouseEnter = (e) => {
		const {parentLink, to} = this;
		const {onMouseEnter} = this.props;

		if (parentLink && parentLink.activateSubLink) {
			parentLink.activateSubLink(to);
		}

		if (onMouseEnter) {
			onMouseEnter(e);
		}
	}


	onMouseLeave = (e) => {
		const {parentLink, to} = this;
		const {onMouseLeave} = this.props;

		if (parentLink && parentLink.deactivateSubLink) {
			parentLink.deactivateSubLink(to);
		}

		if (onMouseLeave) {
			onMouseLeave(e);
		}
	}


	render () {
		const {className, activeClassName, activeStyle, ...otherProps} = this.props;
		const path = resolve(this.baseroute, this.to);
		const cls = cx('nti-link-to-path', className);

		const props = {
			...otherProps
		};

		if (!this.context.router) {
			return (
				<div {...props} className={cls} />
			);
		}

		if (this.parentLink) {
			props.onMouseEnter = this.onMouseEnter;
			props.onMouseLeave = this.onMouseLeave;
			props.component = 'div';
		}

		return activeClassName || activeStyle ?
			(<NavLink {...props} to={path} className={cls} activeClassName={activeClassName} activeStyle={activeStyle} />) :
			(<Link  {...props} to={path} className={cls} />);
	}
}
