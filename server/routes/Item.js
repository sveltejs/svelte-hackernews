'use strict';

function hostname ( url ) {
	const match = /^https?:\/\/(?:w{3}\.)?([^\/]+)/.exec( url );
	return match ? match[1] : '...';
}

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function plural ( num, unit ) {
	num = ~~num;
	if ( num !== 1 ) unit += 's';
	return `${num} ${unit}`;
}
	
function timebetween ( a, b ) {
	const elapsed = b - a;

	if ( elapsed < HOUR ) {
		return plural( elapsed / MINUTE, 'minute' );
	} else if ( elapsed < DAY ) {
		return plural( elapsed / HOUR, 'hour' );
	} else {
		return plural( elapsed / DAY, 'day' );
	}
}

var template$1 = (function () {
	return {
		data () {
			return {
				title: '',
				score: '',
				time: Date.now() / 1e3,
				now: Date.now() / 1e3
			};
		},

		helpers: {
			hostname,
			timebetween
		}
	};
}());

var ItemSummary = {};

ItemSummary.filename = "/www/SVELTE/hacker-news/shared/components/ItemSummary.html";

ItemSummary.data = function () {
	return template$1.data();
};

ItemSummary.render = function ( root, options ) {
	root = Object.assign( template$1.data(), root || {} );
	
	return `<article svelte-4243689397><h2 svelte-4243689397><a href="${root.item.url}" svelte-4243689397>${__escape$1( root.item.title )} ${ root.item.url ? `<small svelte-4243689397>(${__escape$1( template$1.helpers.hostname( root.item.url ) )})</small>` : `` }</a></h2>
	
		<p svelte-4243689397>${__escape$1( root.item.score )} points by <a href="/user/${root.item.by}" svelte-4243689397>${__escape$1( root.item.by )}</a> ${__escape$1( template$1.helpers.timebetween(root.item.time, root.now) )} ago
			${ root.item.descendants != null ? `| <a href="/item/${root.item.id}" svelte-4243689397>${__escape$1( root.item.descendants )} comments</a>` : `` }</p>
	
		<span class="index" svelte-4243689397>${__escape$1( root.index )}</span></article>`;
};

ItemSummary.renderCss = function () {
	var components = [];
	
	components.push({
		filename: ItemSummary.filename,
		css: "\n\tarticle[svelte-4243689397], [svelte-4243689397] article {\n\t\tposition: relative;\n\t\tpadding: 0 0 0 2.5em;\n\t\tmargin: 0 0 1.5em 0;\n\t\tfont-family: Roboto;\n\t}\n\n\th2[svelte-4243689397], [svelte-4243689397] h2 {\n\t\tfont-size: 1em;\n\t\tfont-weight: 400;\n\t\tmargin: 0 0 0.5em 0;\n\t\tcolor: #333;\n\t}\n\n\th2[svelte-4243689397] a, [svelte-4243689397] h2 a {\n\t\ttext-decoration: none;\n\t}\n\n\tp[svelte-4243689397], [svelte-4243689397] p {\n\t\tfont-size: 0.8em;\n\t\tcolor: #888;\n\t\tmargin: 0;\n\t}\n\n\tsmall[svelte-4243689397], [svelte-4243689397] small {\n\t\tcolor: #888;\n\t}\n\n\t[svelte-4243689397].index, [svelte-4243689397] .index {\n\t\tposition: absolute;\n\t\tfont-family: Rajdhani;\n\t\tfont-size: 1.6em;\n\t\tfont-weight: 200;\n\t\tcolor: #888;\n\t\tleft: 0.2em;\n\t\ttop: 0;\n\t\ttext-align: right;\n\t\twidth: 0.75em;\n\t\tline-height: 1;\n\t}\n",
		map: null // TODO
	});
	
	return {
		css: components.map( x => x.css ).join( '\n' ),
		map: null,
		components
	};
};

var escaped$1 = {
	'"': '&quot;',
	"'": '&#39;',
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;'
};

function __escape$1 ( html ) {
	return String( html ).replace( /["'&<>]/g, match => escaped$1[ match ] );
}

var template$2 = (function () {
	return {
		data () {
			return {
				now: Date.now() / 1e3
			};
		},

		helpers: {
			timebetween
		}
	};
}());

var Comment = {};

Comment.filename = "/www/SVELTE/hacker-news/shared/components/Comment.html";

Comment.data = function () {
	return template$2.data();
};

Comment.render = function ( root, options ) {
	root = Object.assign( template$2.data(), root || {} );
	
	return `${ !root.comment.deleted ? `<article class="comment" svelte-3089283103><span class="meta" svelte-3089283103><a href="/user/${root.comment.by}" svelte-3089283103>${__escape$2( root.comment.by )}</a> ${__escape$2( template$2.helpers.timebetween(root.comment.time, root.now) )} ago</span>
			<div class="body" svelte-3089283103>${'<p>' + root.comment.text}</div>
	
			${ root.comment.children && root.comment.children.length ? `<ul class="children" svelte-3089283103>${ root.comment.children.map( child => `<li svelte-3089283103>${Comment.render({comment: child})}</li>` ).join( '' )}</ul>` : `` }</article>` : `` }`;
};

Comment.renderCss = function () {
	var components = [];
	
	components.push({
		filename: Comment.filename,
		css: "\n\t[svelte-3089283103].comment, [svelte-3089283103] .comment {\n\t\tborder-top: 1px solid #eee;\n\t\tpadding: 1em 0 0 0;\n\t}\n\n\t[svelte-3089283103].comment .children, [svelte-3089283103] .comment .children {\n\t\tpadding: 0 0 0 1em;\n\t}\n\n\t@media (min-width: 720px) {\n\t\t[svelte-3089283103].comment .children, [svelte-3089283103] .comment .children {\n\t\t\tpadding: 0 0 0 2em;\n\t\t}\n\t}\n\n\tli[svelte-3089283103], [svelte-3089283103] li {\n\t\tlist-style: none;\n\t}\n\n\tp[svelte-3089283103], [svelte-3089283103] p {\n\t\tline-height: 1.4;\n\t\tfont-size: 14px;\n\t\tmargin: 0 0 1em 0;\n\t}\n\n\tpre[svelte-3089283103], [svelte-3089283103] pre {\n\t\twhite-space: pre-wrap;\n\t}\n\n\t[svelte-3089283103].meta, [svelte-3089283103] .meta {\n\t\tdisplay: block;\n\t\tfont-size: 14px;\n\t\tcolor: #888;\n\t\tmargin: 0 0 1em 0;\n\t}\n\n\ta[svelte-3089283103], [svelte-3089283103] a {\n\t\tcolor: #888;\n\t}\n\n\t\n\t[svelte-3089283103].body *, [svelte-3089283103] .body * {\n\t\toverflow-wrap: break-word;\n\t}\n",
		map: null // TODO
	});
	
	return {
		css: components.map( x => x.css ).join( '\n' ),
		map: null,
		components
	};
};

var escaped$2 = {
	'"': '&quot;',
	"'": '&#39;',
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;'
};

function __escape$2 ( html ) {
	return String( html ).replace( /["'&<>]/g, match => escaped$2[ match ] );
}

const commentsCache = {};

function getComments ( id ) {
	if ( !commentsCache[ id ] ) {
		const promise = getJSON( `/comments/${id}.json` ).catch( err => {
			commentsCache[ id ] = null;
		});

		commentsCache[ id ] = promise;
	}

	return commentsCache[ id ];
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

var template = (function () {
	return {
		data () {
			return {
				item: null,
				comments: [],
				loading: true,
				now: Date.now() / 1e3
			};
		},

		helpers: {
			hostname,
			timebetween
		},

		components: {
			ItemSummary,
			Comment
		},

		oncreate () {
			const item = this.get( 'item' );

			getComments( item.id ).then( comments => {
				this.set({
					loading: false,
					comments
				});

				window.scrollTo( 0, this.get( 'scrollY' ) );
			});
		}
	};
}());

var Item = {};

Item.filename = "/www/SVELTE/hacker-news/shared/routes/Item.html";

Item.data = function () {
	return template.data();
};

Item.render = function ( root, options ) {
	root = Object.assign( template.data(), root || {} );
	
	return `<article class="item" svelte-2572366159><a class="main-link" href="${root.item.url}" svelte-2572366159><h1 svelte-2572366159>${__escape( root.item.title )}</h1>
			${ root.item.url ? `<small svelte-2572366159>${__escape( template.helpers.hostname( root.item.url ) )}</small>` : `` }</a>
	
		<p class="meta" svelte-2572366159>${__escape( root.item.score )} points by <a href="/user/${root.item.by}" svelte-2572366159>${__escape( root.item.by )}</a> ${__escape( template.helpers.timebetween( root.item.time, root.now ) )} ago</p></article>
	
	${ root.item.descendants ? `<h3 svelte-2572366159>${__escape( root.item.descendants )} comments ${ root.loading ? `(...loading)` : `` }</h3> ` : `<h3 svelte-2572366159>No comments yet</h3>` }
	
	<div class="comments" svelte-2572366159>${ root.comments.map( comment => `${ !comment.deleted ? `${template.components.Comment.render({comment: comment})}` : `` }` ).join( '' )}</div>`;
};

Item.renderCss = function () {
	var components = [];
	
	components.push({
		filename: Item.filename,
		css: "\n\th3[svelte-2572366159], [svelte-2572366159] h3 {\n\t\tmargin: 0 0 1em 0;\n\t}\n\n\t[svelte-2572366159].item, [svelte-2572366159] .item {\n\t\tborder-bottom: 1em solid #f4f4f4;\n\t\tmargin: 0 -2em 2em -2em;\n\t\tpadding: 0 2em 2em 2em;\n\t}\n\n\t[svelte-2572366159].main-link, [svelte-2572366159] .main-link {\n\t\tdisplay: block;\n\t\ttext-decoration: none;\n\t}\n\n\tsmall[svelte-2572366159], [svelte-2572366159] small {\n\t\tdisplay: block;\n\t\tfont-size: 14px;\n\t}\n\n\t[svelte-2572366159].meta, [svelte-2572366159] .meta {\n\t\tfont-size: 0.8em;\n\t\tcolor: #666;\n\t}\n",
		map: null // TODO
	});
	
	var seen = {};
	
	function addComponent ( component ) {
		var result = component.renderCss();
		result.components.forEach( x => {
			if ( seen[ x.filename ] ) return;
			seen[ x.filename ] = true;
			components.push( x );
		});
	}
	
	addComponent( template.components.ItemSummary );
	addComponent( template.components.Comment );
	
	return {
		css: components.map( x => x.css ).join( '\n' ),
		map: null,
		components
	};
};

var escaped = {
	'"': '&quot;',
	"'": '&#39;',
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;'
};

function __escape ( html ) {
	return String( html ).replace( /["'&<>]/g, match => escaped[ match ] );
}

module.exports = Item;
