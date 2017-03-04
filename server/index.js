require( 'reify' );
require( 'svelte/ssr/register' );

const fs = require( 'fs' );
const LRU = require( 'lru-cache' );
const express = require( 'express' );
const compression = require( 'compression' );

const db = require( './db.js' ).default;
const lists = require( '../shared/lists.js' ).default;

const app = express();

app.use( compression({ threshold: 0 }) );
app.use( express.static( 'public' ) );

let { css } = require( '../shared/App.html' ).renderCss();
css = fs.readFileSync( 'server/templates/main.css', 'utf-8' ) + css;
app.get( '/main.css', ( req, res ) => {
	res.writeHead( 200, {
		'Content-Length': css.length,
		'Content-Type': 'text/css'
	});

	res.end( css );
});

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

lists.forEach( list => {
	app.get( `/${list.type}/:page.json`, ( req, res ) => {
		getPage( list.type, req.params.page ).then( data => serveJSON( res, data ) );
	});

	app.get( `/${list.type}/:page`, ( req, res ) => {
		const Nav = require( '../shared/components/Nav.html' );
		const List = require( '../shared/routes/List.html' );

		getPage( list.type, req.params.page ).then( data => {
			serve( res, {
				title: 'Svelte Hacker News',
				nav: Nav.render({ route: list.type }),
				route: List.render( data )
			});
		}).catch( err => {
			console.log( err.stack );
		});
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

app.get( '/about', ( req, res ) => {
	const Nav = require( '../shared/components/Nav.html' );
	const About = require( '../shared/routes/About.html' );

	serve( res, {
		title: `Svelte Hacker News`,
		nav: Nav.render({ route: 'about' }),
		route: About.render()
	});
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