import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Logger from 'nti-util-logger';

import {resolve} from '../utils';
import Link from '../fork/Link';
import NavLink from '../fork/NavLink';

const logger = Logger.get('nti-web-routing:link-to:path');

export default class PathLink extends React.Component {
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
				deactivateSubLink: this.deactivateSubLink
			}
		};
	}


	navigateToSubLink = (link) => {
		this.setState({
			toOverride: link
		});
	}


	activateSubLink = (link) => {
		this.setState({
			toOverride: link
		});
	}


	deactivateSubLink = (link) => {
		const {toOverride} = this.state;

		if (link !== toOverride) {
			logger.warn('Deactivating a link that is not active...');
		} else {
			this.setState({
				toOverride: null
			});
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

		if (this.parentLink) {
			props.onMouseEnter = this.onMouseEnter;
			props.onMouseLeave = this.onMouseLeave;
			props.component = 'span';
		}

		return activeClassName || activeStyle ?
			(<NavLink {...props} to={path} onClick={this.onClick} className={cls} activeClassName={activeClassName} activeStyle={activeStyle} />) :
			(<Link  {...props} to={path} onClick={this.onClick} className={cls} />);
	}
}
