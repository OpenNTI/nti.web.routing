import {createBrowserHistory} from 'history';

let history;

//TODO: maybe write a custom history object since this one does
//not let you push titles on to history.
export default function createHistory () {
	history = history || createBrowserHistory();

	return history;
}
