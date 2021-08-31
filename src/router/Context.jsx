import React from 'react';
import PropTypes from 'prop-types';

import { ContextMerger } from './utils/context-merger';

const Context = React.createContext();

RouterContext.useRouter = () => {
	return React.useContext(Context);
};
RouterContext.contextTypes = {
	router: PropTypes.object,
};

export default function RouterContext({ children }, context) {
	return (
		<ContextMerger>
			{router => (
				<Context.Provider value={{ ...router, ...context?.router }}>
					{children}
				</Context.Provider>
			)}
		</ContextMerger>
	);
}
