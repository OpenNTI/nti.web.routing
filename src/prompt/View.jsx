import React from 'react';
import PropTypes from 'prop-types';

import Router from '../router';
import getHistory from '../history';

import {addPrompt} from './Store';

RouterPromptInner.propTypes = {
	onRoute: PropTypes.func
};
function RouterPromptInner ({onRoute}) {
	const router = Router.useRouter();

	React.useEffect(() => {
		const history = router?.history ?? getHistory();

		return addPrompt(onRoute, history);
	},[router, onRoute]);

	return null;
}

RouterPrompt.propTypes = {
	when: PropTypes.bool
};
export default function RouterPrompt ({when, ...otherProps}) {
	if (!when) { return null; }

	return (
		<RouterPromptInner {...otherProps} />
	);
}

