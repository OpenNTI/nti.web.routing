export {default as getHistory} from './history';
export * as LinkTo from './link-to';
export * as Matches from './matches';
export {default as Prompt} from './prompt';
export * as RedirectTo from './redirect-to';
export {default as Route} from './route';
export {default as Router} from './router';
export * as View from './view';
export {default as Disable} from './router/Disable';
export * from './utils';

import {
	useLocation,
	useHistory,
	useParams,
	useRouteMatch,
} from 'react-router';

export {
	useHistory,
	useLocation,
	useParams,
	useRouteMatch,
};
