import React, { useContext, useEffect, useMemo, useState } from 'react';

/**
 * @typedef {() => void} RestorerFunction
 * The restore function is responsible for calling setState/dispatch to "restore" the view.
 * Its like the back button, but for non-routed views.
 */

/** @class */
class StackInterface {
	constructor(stack, update) {
		const { length } = stack;

		this.valid = !!update;

		/** Execute the top restorer and remove it from the stack. */
		this.pop =
			length === 0
				? null
				: () => {
						const last = stack.length - 1;
						stack[last]?.();
						update?.(stack.slice(0, last));
				  };

		/**
		 * push a new restorer onto the stack.
		 *
		 * @param {RestorerFunction} fn
		 */
		this.push = fn => {
			//freeze makes attempts to edit the array fail
			update?.(Object.freeze([...stack, fn]));
		};

		this.reset = () => {
			update?.([]);
		};

		this.length = length;
	}
}

/**
 * @type {React.Context<StackInterface>}
 */
export const NavigationStackContext = React.createContext(
	new StackInterface([])
);

export function NavigationStackManager({ children }) {
	const parent = useContext(NavigationStackContext);
	/** @type {[RestorerFunction[], (restorer: RestorerFunction) => void]} */
	const [stack, setStack] = useState([]);

	//TODO: Maybe hook into history and allow back button to trigger pops. (pushes can't be re-constituted so pops are one way... )
	const value = useMemo(
		() => (parent.valid ? parent : new StackInterface(stack, setStack)),
		[stack, parent]
	);

	useEffect(() => value.reset, []);

	return (
		<NavigationStackContext.Provider value={value}>
			{children}
		</NavigationStackContext.Provider>
	);
}

/**
 * @returns {StackInterface}
 */
export const useNavigationStackContext = () =>
	useContext(NavigationStackContext);
