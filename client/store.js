import getJSON from './utils/getJSON.js';

const itemCache = {};

export function getItem ( id ) {
	if ( !itemCache[ id ] ) {
		const promise = getJSON( `/item/${id}.json` ).catch( err => {
			itemCache[ id ] = null;
		});

		itemCache[ id ] = promise;
	}

	return itemCache[ id ];
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