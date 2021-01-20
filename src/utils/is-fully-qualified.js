const PROTOCOL_LESS = /^\/\/.*/;//starts with //

export function isFullyQualified (part) {
	if (part == null) {
		return true;
	}
	try {
		// URL constructor will throw if the input is not fully qualified
		return Boolean(new URL(part));
	} catch {
		return PROTOCOL_LESS.test(part);
	}
}
