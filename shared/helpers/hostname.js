export default function hostname ( url ) {
	const match = /^https?:\/\/(?:w{3}\.)?([^\/]+)/.exec( url );
	return match ? match[1] : '...';
}