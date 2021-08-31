import React, { useMemo } from 'react';
import { Router } from 'react-router-dom';

import getHistory from '../history';

export function BrowserRouter({ children }) {
	const history = useMemo(getHistory, []);
	return <Router history={history}>{children}</Router>;
}
