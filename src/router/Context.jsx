import React, { useContext } from 'react';
import PropTypes from 'prop-types';

const Context = React.createContext();

export default class RouterContext extends React.Component {
	static useRouter = () => {
		return useContext(Context);
	};

	static propTypes = {
		children: PropTypes.any,
	};

	static contextTypes = {
		router: PropTypes.object,
	};

	render() {
		const { children } = this.props;
		const { router } = this.context;

		return <Context.Provider value={router}>{children}</Context.Provider>;
	}
}
