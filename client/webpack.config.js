module.exports = {
	entry: './client/main.js',
	output: {
		filename: 'public/bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.(html|svelte)$/,
				exclude: /node_modules/,
				loader: 'svelte-loader',
				query: {
					css: false
				}
			}
		]
	}
}