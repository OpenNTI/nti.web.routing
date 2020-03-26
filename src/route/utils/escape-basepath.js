export default function escapeBasePath (basepath) {
	return basepath
		.replace('+', '\\+');
}