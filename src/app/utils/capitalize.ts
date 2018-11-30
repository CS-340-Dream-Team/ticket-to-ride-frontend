export default function capitalize(lower: string) {
	return lower.charAt(0).toUpperCase() + lower.substr(1);
}
