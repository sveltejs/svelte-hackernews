require( 'reify' );
require( 'svelte/ssr/register' );

const fs = require( 'fs' );
const LRU = require( 'lru-cache' );
const express = require( 'express' );
const compression = require( 'compression' );
const db = require( './db.js' ).default;

const app = express();

app.use( compression({ threshold: 0 }) );
app.use( express.static( 'public' ) );

const { css } = require( '../shared/App.html' ).renderCss();
app.get( '/main.css', ( req, res ) => {
	res.writeHead( 200, {
		'Content-Length': css.length,
		'Content-Type': 'text/css'
	});

	res.end( css );
});

const cached = {
	topstories: []
};

db.child( 'topstories' ).on( 'value', snapshot => {
	cached.topstories = snapshot.val();
});

const PAGE_SIZE = 20;

function getPage ( page ) {
	const end = page * PAGE_SIZE;
	const start = end - PAGE_SIZE;

	return Promise.all(
		cached.topstories.slice( start, end ).map( getItem )
	);
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

const template = fs.readFileSync( 'server/templates/index.html', 'utf-8' );

function serveJSON ( res, data ) {
	const json = JSON.stringify( data );

	res.writeHead( 200, {
		'Content-Length': json.length,
		'Content-Type': 'application/json'
	});

	res.end( json );
}

function serve ( res, { title, nav, route }) {
	const result = template
		.replace( '__TITLE__', title )
		.replace( '__NAV__', nav )
		.replace( '__ROUTE__', route );

	res.writeHead( 200, {
		'Content-Length': result.length,
		'Content-Type': 'text/html'
	});

	res.end( result );
}

app.get( '/', ( req, res ) => {
	res.redirect( '/top/1' );
});

app.get( '/top/:page.json', ( req, res ) => {
	getPage( req.params.page ).then( data => serveJSON( res, data ) );
});

app.get( '/top/:page', ( req, res ) => {
	const Nav = require( '../shared/components/Nav.html' );
	const Top = require( '../shared/routes/Top.html' );

	getPage( req.params.page ).then( items => {
		serve( res, {
			title: 'Svelte Hacker News',
			nav: Nav.render({ route: 'top' }),
			route: Top.render({ items })
		});
	}).catch( err => {
		console.log( err.stack );
	});
});

app.get( '/item/:id.json', ( req, res ) => {
	getItem( req.params.id ).then( data => serveJSON( res, data ) );
});

app.get( '/item/:id', ( req, res ) => {
	const Nav = require( '../shared/components/Nav.html' );
	const Item = require( '../shared/routes/Item.html' );

	getItem( req.params.id ).then( item => {
		serve( res, {
			title: `${item.title} | Svelte Hacker News`,
			nav: Nav.render({ route: 'item' }),
			route: Item.render({ item })
		});
	}).catch( err => {
		console.log( err.stack );
	});
});

app.get( '/user/:name.json', ( req, res ) => {
	getUser( req.params.name ).then( data => serveJSON( res, data ) );
});

app.get( '/user/:id', ( req, res ) => {
	const Nav = require( '../shared/components/Nav.html' );
	const User = require( '../shared/routes/User.html' );

	getUser( req.params.id ).then( user => {
		serve( res, {
			title: `Profile: ${user.id} | Svelte Hacker News`,
			nav: Nav.render({ route: 'user' }),
			route: User.render({ user })
		});
	}).catch( err => {
		console.log( err.stack );
	});
});

function getComment ( id ) {
	return getItem( id ).then( item => {
		return Promise.all( item.kids ? item.kids.map( getComment ) : [] ).then( comments => {
			return Object.assign({ children: comments }, item );
		});
	})
}

app.get( '/comments/:id.json', ( req, res ) => {
	getItem( req.params.id ).then( item => {
		return Promise.all( item.kids ? item.kids.map( getComment ) : [] );
	}).then( comments => {
		serveJSON( res, comments );
	});
});


app.listen( '3000', () => {
	console.log( 'listening on localhost:3000' );
});