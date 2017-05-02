import replace from 'rollup-plugin-replace';
import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';
import glob from 'glob';

const dev = !!process.env.DEV;

console.log( `creating ${dev ? 'development' : 'production'} service worker` ); // eslint-disable-line no-console

const manifest = [].concat(
	// routes
	// TODO create an empty app shell instead...
	'/',

	// js
	'/bundle.js',

	// css
	'/main.css',

	// fonts
	glob.sync( 'fonts/**/*.woff?(2)', { cwd: 'public' }).map( x => `/${x}` )
);

export default {
	entry: 'service-worker/main.js',
	dest: 'public/sw.js',
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