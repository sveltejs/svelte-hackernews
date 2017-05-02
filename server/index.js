const fs = require( 'fs' );
const path = require( 'path' );
const LRU = require( 'lru-cache' );
const express = require( 'express' );
const compression = require( 'compression' );

const db = require( './db.js' );
const lists = require( '../shared/lists.js' );

const app = express();

app.use( compression({ threshold: 0 }) );
app.use( express.static( 'public' ) );

const cached = {};
lists.forEach( list => {
	cached[ list.id ] = [];
});

lists.forEach( list => {
	db.child( `${list.type}stories` ).on( 'value', snapshot => {
		cached[ list.type ] = snapshot.val();
	});
});

const PAGE_SIZE = 20;

function getPage ( type, page ) {
	page = +page;
	const end = page * PAGE_SIZE;
	const start = end - PAGE_SIZE;

	const data = cached[ type ];

	return Promise.all(
		data.slice( start, end ).map( getItem )
	).then( items => {
		return {
			page,
			items,
			start: start + 1,
			end,
			next: end < data.length ? `/${type}/${page + 1}` : null
		};
	});
}

const items = LRU( 100 );

function getItem ( id ) {
	if ( !items.has( id ) ) {
		const promise = new Promise( fulfil => {
			db.child( `/item/${id}` ).once( 'value', snapshot => {
				fulfil( snapshot.val() );
			});
		});

		items.set( id, promise, 30 );
	}

	return items.get( id );
}

const users = LRU( 100 );

function getUser ( id ) {
	if ( !users.has( id ) ) {
		const promise = new Promise( fulfil => {
			db.child( `/user/${id}` ).once( 'value', snapshot => {
				fulfil( snapshot.val() );
			});
		});

		users.set( id, promise, 30 );
	}

	return users.get( id );
}

const template = fs.readFileSync( `${__dirname}/templates/index.html`, 'utf-8' );

const templateChunks = [];
const pattern = /__(\w+)__/g;
let match;
let c = 0;

while ( match = pattern.exec( template ) ) {
	templateChunks.push({
		type: 'static',
		content: template.slice( c, match.index )
	});

	templateChunks.push({
		type: 'dynamic',
		content: match[1]
	});

	c = match.index + match[0].length;
}

templateChunks.push({
	type: 'static',
	content: template.slice( c )
});

function serveJSON ( res, data ) {
	const json = JSON.stringify( data );

	res.writeHead( 200, {
		'Content-Length': json.length,
		'Content-Type': 'application/json',
		'Cache-Control': 'max-age=30'
	});

	res.end( json );
}

const preload = [
	`</bundle.js>; rel=preload; as=script`,
	`</main.css>; rel=preload; as=style`,

	// only preload the essential fonts for initial render
	`</fonts/rajdhani-light.woff2>; rel=preload; as=font; type='font/woff2'`,
	`</fonts/roboto-regular.woff2>; rel=preload; as=font; type='font/woff2'`
].join( ', ' );

function serve ( res, data, maxAge = 30 ) {
	res.writeHead( 200, {
		'Content-Type': 'text/html',
		'Cache-Control': `max-age=${maxAge}`,
		Link: preload
	});

	let promise = Promise.resolve();
	templateChunks.forEach( chunk => {
		promise = promise.then( () => {
			if ( chunk.type === 'static' ) {
				res.write( chunk.content );
			}

			else {
				return Promise.resolve( data[ chunk.content ] ).then( content => {
					res.write( content );
				});
			}
		});
	});

	return promise.then( () => {
		res.end();
	});
}

function serveListPage ( req, res, type, page ) {
	const Nav = require( './components/Nav.js' );
	const List = require( './routes/List.js' );

	serve( res, {
		title: 'Svelte Hacker News',
		nav: Nav.render({ route: type }),
		route: getPage( type, page ).then( data => List.render( data ) )
	}).catch( err => {
		console.log( err.stack );
	});
}

app.get( '/', ( req, res ) => {
	serveListPage( req, res, 'top', 1 );
});

lists.forEach( list => {
	app.get( `/${list.type}/:page.json`, ( req, res ) => {
		getPage( list.type, req.params.page ).then( data => serveJSON( res, data ) );
	});

	app.get( `/${list.type}/:page`, ( req, res ) => {
		serveListPage( req, res, list.type, req.params.page );
	});
});

app.get( '/item/:id.json', ( req, res ) => {
	getItem( req.params.id ).then( data => serveJSON( res, data ) );
});

app.get( '/item/:id', ( req, res ) => {
	const Nav = require( './components/Nav.js' );
	const Item = require( './routes/Item.js' );

	const promise = getItem( req.params.id );

	serve( res, {
		title: promise.then( item => `${item.title} | Svelte Hacker News` ),
		nav: Nav.render({ route: 'item' }),
		route: promise.then( item => Item.render({ item }) )
	}).catch( err => {
		console.log( err.stack );
	});
});

app.get( '/user/:name.json', ( req, res ) => {
	getUser( req.params.name ).then( data => serveJSON( res, data ) );
});

app.get( '/user/:id', ( req, res ) => {
	const Nav = require( './components/Nav.js' );
	const User = require( './routes/User.js' );

	serve( res, {
		title: `Profile: ${req.params.id} | Svelte Hacker News`,
		nav: Nav.render({ route: 'user' }),
		route: getUser( req.params.id ).then( user => User.render({ user }) )
	}).catch( err => {
		console.log( err.stack );
	});
});

app.get( '/about', ( req, res ) => {
	const Nav = require( './components/Nav.js' );
	const About = require( './routes/About.js' );

	serve( res, {
		title: `Svelte Hacker News`,
		nav: Nav.render({ route: 'about' }),
		route: About.render()
	}, 60 * 60 * 24 * 1000 );
});

function getComment ( id ) {
	return getItem( id ).then( item => {
		return Promise.all( item && item.kids ? item.kids.map( getComment ) : [] ).then( comments => {
			return Object.assign({ children: comments }, item );
		});
	});
}

app.get( '/comments/:id.json', ( req, res ) => {
	getItem( req.params.id ).then( item => {
		return Promise.all( item && item.kids ? item.kids.map( getComment ) : [] );
	}).then( comments => {
		serveJSON( res, comments );
	});
});


app.listen( '3000', () => {
	console.log( 'listening on localhost:3000' );
});