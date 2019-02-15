export default function getFrameProps (props) {
	const {match} = props || {};
	const {params} = match || {};

	return params || {};
}
