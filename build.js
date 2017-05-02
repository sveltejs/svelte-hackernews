const fs = require( 'fs' );
const path = require( 'path' );
const rollup = require( 'rollup' );
const svelte = require( 'rollup-plugin-svelte' );

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