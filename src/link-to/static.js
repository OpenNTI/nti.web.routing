import getHistory from '../history';

export const goHome = () => {
	const history = getHistory();
	const parts = history.location.pathname.split('/');

	history.push(`/${parts[1]}/`);
};
