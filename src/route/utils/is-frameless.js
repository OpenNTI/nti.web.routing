function definesProp (frame) {
	return frame.propTypes && frame.propTypes.frameless;
}

export default function isFrameless (frame, frameless) {
	return !frame || (frameless && !definesProp(frame));
}
