export default function getParamProps(route) {
	const { match } = route || {};
	const { params } = match || {};

	return params || {};
}
