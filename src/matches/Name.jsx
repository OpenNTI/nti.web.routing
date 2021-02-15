import React from 'react';
import PropTypes from 'prop-types';

import Path from './Path';

export default class MatchesName extends React.Component {
	static propTypes = {
		name: PropTypes.string.isRequired,
		render: PropTypes.func,
	};

	static contextTypes = {
		router: PropTypes.shape({
			getRouteFor: PropTypes.func,
		}),
	};

	render() {
		const {
			props: { name },
			context: { router },
		} = this;

		const path = router.getRouteFor(name);

		const props = {
			...this.props,
			path,
		};

		return <Path {...props} />;
	}
}
