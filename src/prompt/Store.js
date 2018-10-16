let active = null;

export function addPrompt (prompt, history) {
	//NOTE: in the future we could turn prompts into a queue
	// if more than one mounted component wants to stop navigation
	if (active) {
		console.warn('Router only supports one prompt at a time!');//eslint-disable-line
	}

	const cleanup = history.block('Navigation Blocked');
	active = prompt;

	return () => {
		if (active === prompt) {
			active = null;
			cleanup();
		}
	};
}


export function getPrompt () {
	return active;
}
