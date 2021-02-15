import React from 'react';
import PropTypes from 'prop-types';
import { buffer } from '@nti/lib-commons';

const SEPARATOR = ' - ';

const updateTitle = buffer(300, title => {
	if (typeof document !== 'undefined') {
		document.title = title || '';
	}
});

export default class RouteViewWithTitle extends React.Component {
	static propTypes = {
		title: PropTypes.string,
		children: PropTypes.node,
	};

	static contextTypes = {
		setRouteViewTitle: PropTypes.func,
	};

	static childContextTypes = {
		setRouteViewTitle: PropTypes.func,
	};

	getChildContext() {
		return {
			setRouteViewTitle: (...args) => {
				this.setSubTitle(...args);
			},
		};
	}

	setTitle(title, subTitle) {
		const { setRouteViewTitle } = this.context;

		let fullTitle;

		if (subTitle && title) {
			fullTitle = `${subTitle}${SEPARATOR}${title}`;
		} else if (subTitle) {
			fullTitle = subTitle;
		} else {
			fullTitle = title;
		}

		if (setRouteViewTitle) {
			setRouteViewTitle(fullTitle || '');
		} else {
			updateTitle(fullTitle);
		}
	}

	setSubTitle(subTitle) {
		const { title } = this.props;

		this.subTitle = subTitle;

		this.setTitle(title, subTitle);
	}

	componentDidMount() {
		const { title } = this.props;

		this.setTitle(title, this.subTitle);
	}

	componentDidUpdate(prevProps) {
		const { title: newTitle } = this.props;
		const { title: oldTitle } = prevProps;

		if (newTitle !== oldTitle) {
			this.setTitle(newTitle, this.subTitle);
		}
	}

	render() {
		return this.props.children;
	}
}
