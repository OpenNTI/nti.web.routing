import {createBrowserHistory} from 'history';

import {getPrompt} from '../prompt/Store';

let history;

//TODO: maybe write a custom history object since this one does
//not let you push titles on to history.
export default function getHistory () {
	history = history || createBrowserHistory({
		getUserConfirmation: (_, callback) => {
			const prompt = getPrompt();

			if (prompt) {
				return prompt(
					x => callback(x == null ? true : x),
					() => callback(false)
				);
			}

			callback(true);
		}
	});

	return history;
}
