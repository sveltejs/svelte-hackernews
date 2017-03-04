const itemCache = {};

export function getItem ( id ) {
	if ( !itemCache[ id ] ) {
		const promise = getJSON( `https://hacker-news.firebaseio.com/v0/item/${id}.json` ).catch( err => {
			itemCache[ id ] = null;
		});

		itemCache[ id ] = promise;

		// remove from cache after 60 seconds
		setTimeout( () => {
			if ( itemCache[ id ] === promise ) itemCache[ id ] = null;
		}, 60 * 1000 );
	}

	return itemCache[ id ];
}

export function getPage ( type, page ) {
	return getJSON( `/${type}/${page}.json` ).then( data => {
		data.items.forEach( item => {
			const promise = itemCache[ item.id ] = Promise.resolve( item );

			// remove from cache after 60 seconds
			setTimeout( () => {
				if ( itemCache[ item.id ] === promise ) itemCache[ item.id ] = null;
			}, 60 * 1000 );
		});

		return data;
	});
}

const commentsCache = {};

export function getComments ( id ) {
	if ( !commentsCache[ id ] ) {
		const promise = getJSON( `/comments/${id}.json` ).catch( err => {
			commentsCache[ id ] = null;
		});

		commentsCache[ id ] = promise;
	}

	return commentsCache[ id ];
}

const userCache = {};

export function getUser ( id ) {
	if ( !userCache[ id ] ) {
		const promise = getJSON( `/user/${id}.json` ).catch( err => {
			userCache[ id ] = null;
		});

		userCache[ id ] = promise;
	}

	return userCache[ id ];
}

function getJSON ( url ) {
	return new Promise( ( fulfil, reject ) => {
		const xhr = new XMLHttpRequest();
		xhr.onload = () => fulfil( JSON.parse( xhr.responseText ) );
		xhr.onerror = reject;

		xhr.open( 'GET', url );
		xhr.send();
	});
}