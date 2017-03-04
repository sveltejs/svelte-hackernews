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

var template = (function () {
	return {
		data () {
			return {
				items: []
			}
		},

		components: {
			ItemSummary
		}
	};
}());

var List = {};

List.filename = "/www/SVELTE/hacker-news/shared/routes/List.html";

List.data = function () {
	return template.data();
};

List.render = function ( root, options ) {
	root = Object.assign( template.data(), root || {} );
	
	return `${ root.items.map( ( item, i ) => `${template.components.ItemSummary.render({item: item, index: root.start + i})}` ).join( '' )}
	
	${ root.next ? `<a class="more" href="${root.next}">More...</a>` : `` }`;
};

List.renderCss = function () {
	var components = [];
	
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
	
	return {
		css: components.map( x => x.css ).join( '\n' ),
		map: null,
		components
	};
};

module.exports = List;
