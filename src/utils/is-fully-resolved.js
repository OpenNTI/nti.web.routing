const PROTOCOL_LESS = /^\/\/.*/;//starts with //
const NULL_PROTO = 'x:';

export function isFullyResolved (part) {
	if (part == null) {
		return true;
	}
	const {protocol, host} = new URL(part, NULL_PROTO + '/');

	return (protocol !== NULL_PROTO && host) || PROTOCOL_LESS.test(part);
}
