export default function getJSON ( url ) {
	return new Promise( ( fulfil, reject ) => {
		const xhr = new XMLHttpRequest();
		xhr.onload = () => fulfil( JSON.parse( xhr.responseText ) );
		xhr.onerror = reject;

		xhr.open( 'GET', url );
		xhr.send();
	});
}