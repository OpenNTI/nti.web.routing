import { resolve } from 'path';

import React, { useContext } from 'react';

export const BasePathContext = React.createContext('/');

export function BasePath({ path, ...props }) {
	const basePath = useContext(BasePathContext);
	return (
		<BasePathContext.Provider value={resolve(basePath, path)} {...props} />
	);
}

export function useBasePath() {
	return useContext(BasePathContext);
}
