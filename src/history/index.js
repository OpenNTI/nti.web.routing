import { createBrowserHistory } from 'history';

import { getPrompt } from '../prompt/Store';

let history;

const getUserConfirmation = (_, callback) => {
	const prompt = getPrompt();

	if (prompt) {
		return prompt(
			x => callback(x == null ? true : x),
			() => callback(false)
		);
	}

	callback(true);
};

//TODO: maybe write a custom history object since this one does
//not let you push titles on to history.
export default function getHistory() {
	if (typeof document === 'undefined' || typeof window === 'undefined') {
		return {};
	}
	if (!history) {
		history = createBrowserHistory({ getUserConfirmation });
		history.awaitUserConfirmation = () => {
			return new Promise((fulfill, reject) =>
				getUserConfirmation(void 0, cont =>
					cont ? fulfill() : reject()
				)
			);
		};
	}

	return history;
}
