import svelte from 'rollup-plugin-svelte';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import buble from 'rollup-plugin-buble';
import CleanCSS from 'clean-css';
import * as fs from 'fs';

const dev = !!process.env.DEVELOPMENT;
const globalStyles = fs.readFileSync( 'server/templates/main.css', 'utf-8' );

export default {
	entry: 'client/main.js',
	dest: 'public/bundle.js',
	format: 'iife',
	plugins: [
		nodeResolve(),
		commonjs(),
		svelte({
			css: componentStyles => {
				let styles = globalStyles.replace( '__components__', componentStyles );
				if ( !dev ) styles = new CleanCSS().minify( styles ).styles;

				fs.writeFileSync( 'public/main.css', styles );
			}
		}),
		buble(),
		!dev && uglify()
	]
};