const fs = require( 'fs' );
const path = require( 'path' );
const Module = require( 'module' );
const rollup = require( 'rollup' );
const svelte = require( 'rollup-plugin-svelte' );
const CleanCSS = require( 'clean-css' );

const shared = path.resolve( __dirname, 'shared' );

function mkdirp ( dir ) {
	const parent = path.dirname( dir );
	if ( parent === dir ) return;

	mkdirp( parent );
	try {
		fs.mkdirSync( dir );
	} catch ( err ) {
		if ( err.code !== 'EEXIST' ) throw err;
	}
}

// generate CSS
rollup.rollup({
	entry: `${__dirname}/shared/App.html`,
	plugins: [
		svelte({
			generate: 'ssr'
		})
	]
}).then( bundle => {
	const { code } = bundle.generate({ format: 'cjs' });

	const m = new Module();
	m._compile( code, `${__dirname}/shared/App.html` );

	const css = fs.readFileSync( `${__dirname}/server/templates/main.css`, 'utf-8' )
		.replace( '__components__', m.exports.renderCss().css );

	const minified = new CleanCSS().minify( css );
	fs.writeFileSync( `${__dirname}/public/main.css`, minified.styles );
});

// generate bundles for each route, plus the nav
[ 'routes/List', 'routes/Item', 'routes/User', 'routes/About', 'components/Nav' ].forEach( entry => {
	rollup.rollup({
		entry: `${__dirname}/shared/${entry}.html`,
		plugins: [
			svelte({
				generate: 'ssr',
				css: false
			})
		]
	}).then( bundle => {
		const { code } = bundle.generate({ format: 'cjs' });

		const dest = `${__dirname}/server/${entry}.js`;
		mkdirp( path.dirname( dest ) );

		fs.writeFileSync( dest, code );
	});
});