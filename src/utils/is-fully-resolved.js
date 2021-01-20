const PROTOCOL_LESS = /^\/\/.*/;//starts with //

export function isFullyResolved (part) {
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
