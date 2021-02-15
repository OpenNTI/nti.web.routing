export default function getPartInfo(part) {
	const isParam = part[0] === ':';

	return {
		raw: part,
		name: part.replace(':', '').replace('?', ''),
		isParam,
		isRequired: part[part.length - 1] !== '?',
	};
}
