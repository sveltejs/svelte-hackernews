const CACHE_NAME = `cache-v__CACHEVERSION__`;
const urlsToCache = __MANIFEST__; // eslint-disable-line no-undef

self.addEventListener( 'install', event => {
	console.log( 'installing service worker' );
	event.waitUntil(
		caches.open( CACHE_NAME )
			.then( cache => {
				return Promise.all(
					urlsToCache.map( url => {
						return cache.add( url ).catch( err => {
							console.error( `Error caching ${url}: ${err.message}` );
						});
					})
				);
			})
			.catch( err => {
				console.error( err.stack );
			})
			.then( () => {
				console.log( `cached ${urlsToCache.length} urls` );
				self.skipWaiting();
			})
	);
});


self.addEventListener( 'activate', event => {
	console.log( 'activating service worker' );
	event.waitUntil(
		caches.keys()
			.then( cacheNames => {
				return Promise.all(
					cacheNames.map( cacheName => {
						if ( cacheName !== CACHE_NAME ) {
							return caches.delete( cacheName );
						}
					})
				)
				.then( () => self.clients.claim() );
			})
	);
});

let shell;

self.addEventListener( 'fetch', event => {
	if ( !/^https?/.test( event.request.url ) ) return;

	// don't cache .json files
	if ( /\.json$/.test( event.request.url ) ) return;

	const path = event.request.url.replace( self.location.origin, '' ).replace( /\?.+/, '' );
	const match = /^\/(?:(top|new|ask|show|job)\/(\d+))?$/.exec( path );
	if ( match ) {
		// kick off request for JSON data
		fetch( `${self.location.origin}/${match[1] || 'top'}/${match[2] || 1}` );

		if ( !shell ) shell = fetch( `${self.location.origin}/shell` );
		event.respondWith( shell.then( response => response.clone() ) );
		return;
	}

	event.respondWith(
		caches.open( CACHE_NAME )
			.then( cache => cache.match( event.request ) )
			.then( response => {
				if ( response ) return response.clone();

				const fetchRequest = event.request.clone();

				return fetch( fetchRequest )
					.then( response => {
						// Check if we received a valid response
						if ( !response || response.status !== 200 || response.type !== 'basic' ) {
							return response;
						}

						caches.open( CACHE_NAME )
							.then( cache => {
								// no need to wait on this before responding
								cache.put( event.request, response ).catch( err => {
									console.error( `failed to cache ${event.request.url}: ${err.stack}` );
								});
							});

						return response.clone();
					});
			})
			.catch( err => {
				console.error( err.stack );
			})
	);
});