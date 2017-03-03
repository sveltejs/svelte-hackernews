import svelte from 'rollup-plugin-svelte';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import buble from 'rollup-plugin-buble';

export default {
	entry: 'client/main.js',
	dest: 'public/bundle.js',
	format: 'iife',
	plugins: [
		nodeResolve({ jsnext: true }),
		commonjs(),
		svelte({
			css: false
		}),
		buble(),
		// uglify()
	]
};