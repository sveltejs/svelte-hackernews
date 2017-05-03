import replace from 'rollup-plugin-replace';
import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';
import glob from 'glob';

const dev = !!process.env.DEV;

console.log( `creating ${dev ? 'development' : 'production'} service worker` ); // eslint-disable-line no-console

const bundle = dev ?
	'/bundle.js' :
	require( '../server/manifests/bundle.json' )[ 'bundle.js' ].replace( 'dist', '' );

const css = dev ?
	'/main.css' :
	require( '../server/manifests/css.json' )[ 'main.css' ].replace( 'dist', '' );

const manifest = [].concat(
	// routes
	// TODO create an empty app shell instead...
	'/?shell=true',
	bundle,
	css,

	// fonts
	glob.sync( 'fonts/**/*.woff?(2)', { cwd: 'public' }).map( x => `/${x}` )
);

export default {
	entry: 'service-worker/src/main.js',
	dest: 'service-worker/dist/sw.js',
	format: 'iife',
	plugins: [
		replace({
			__CACHEVERSION__: Date.now(),
			__MANIFEST__: JSON.stringify( manifest )
		}),
		buble(),
		!dev && uglify()
	],
	sourceMap: true
};