'use strict';

var template = (function () {
	return {
		data () {
			const d = new Date();

			return {
				today: new Date( d.getFullYear(), d.getMonth(), d.getDate() )
			};
		},

		computed: {
			ago ( user, today ) {
				const created = new Date( user.created * 1e3 );
				const elapsedDays = ( today - created ) / ( 86400 * 1e3 );

				if ( elapsedDays < 0 ) return 'today';
				if ( elapsedDays < 1 ) return 'yesterday';
				return Math.ceil( elapsedDays ) + ' days ago';
			}
		}
	};
}());

var User = {};

User.filename = "/www/SVELTE/hacker-news/shared/routes/User.html";

User.data = function () {
	return template.data();
};

User.render = function ( root, options ) {
	root = Object.assign( template.data(), root || {} );
	root.ago = template.computed.ago( root.user, root.today );
	
	return `<h1 svelte-2304066862>${__escape( root.user.id )}</h1>
	
	<p svelte-2304066862>...joined <strong svelte-2304066862>${__escape( root.ago )}</strong>, and has <strong svelte-2304066862>${__escape( root.user.karma )}</strong> karma</p>
	
	<p svelte-2304066862><a href="https://news.ycombinator.com/submitted?id=dang" svelte-2304066862>submissions</a> /
		<a href="https://news.ycombinator.com/threads?id=dang" svelte-2304066862>comments</a> /
		<a href="https://news.ycombinator.com/favorites?id=dang" svelte-2304066862>favourites</a></p>
	
	${ root.user.about ? `<div class="about" svelte-2304066862>${'<p>' + root.user.about}</div>` : `` }`;
};

User.renderCss = function () {
	var components = [];
	
	components.push({
		filename: User.filename,
		css: "\n\n",
		map: null // TODO
	});
	
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

module.exports = User;
