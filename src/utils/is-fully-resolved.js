import Url from 'url';

const PROTOCOLLESS = /^\/\/.*/;//starts with //

export default function isFullyResolved (part) {
	if (part == null) {
		return true;
	}
	const {protocol, host} = Url.parse(part);

	return (protocol && host) || PROTOCOLLESS.test(part);
}
