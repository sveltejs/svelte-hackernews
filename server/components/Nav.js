'use strict';

var Nav = {};

Nav.filename = "/www/SVELTE/hacker-news/shared/components/Nav.html";

Nav.data = function () {
	return {};
};

Nav.render = function ( root, options ) {
	root = root || {};
	
	return `<nav svelte-3688487393><div class="icon" svelte-3688487393><span svelte-3688487393>s</span></div>
	
		<ul svelte-3688487393><li svelte-3688487393><a class="${root.route === "top"  ? "selected" : ""}" href="/top/1" svelte-3688487393>top</a></li>
			<li svelte-3688487393><a class="${root.route === "new"  ? "selected" : ""}" href="/new/1" svelte-3688487393>new</a></li>
			<li svelte-3688487393><a class="${root.route === "show" ? "selected" : ""}" href="/show/1" svelte-3688487393>show</a></li>
			<li svelte-3688487393><a class="${root.route === "ask"  ? "selected" : ""}" href="/ask/1" svelte-3688487393>ask</a></li>
			<li svelte-3688487393><a class="${root.route === "job"  ? "selected" : ""}" href="/job/1" svelte-3688487393>jobs</a></li>
	
			<li class="about" svelte-3688487393><a class="${root.route === "about"  ? "selected" : ""}" href="/about" svelte-3688487393>about</a></li></ul></nav>`;
};

Nav.renderCss = function () {
	var components = [];
	
	components.push({
		filename: Nav.filename,
		css: "\n\tnav[svelte-3688487393], [svelte-3688487393] nav {\n\t\tbackground-color: rgb(170,30,30);\n\t\tcolor: white;\n\t\tfont-family: Rajdhani;\n\t\tpadding: 1em;\n\t}\n\n\t[svelte-3688487393].icon, [svelte-3688487393] .icon {\n\t\tdisplay: inline-block;\n\t\twidth: 0.8em;\n\t\theight: 0.8em;\n\t\tborder: 1px solid white;\n\t\tfloat: left;\n\t\ttext-align: center;\n\t\tline-height: 1;\n\t\tfont-size: 2em;\n\t\tposition: relative;\n\t\ttop: -0.1em;\n\t\tbox-sizing: border-box;\n\t\tmargin: 0 0.5em 0 0;\n\t\topacity: 0.6;\n\t}\n\n\t[svelte-3688487393].icon span, [svelte-3688487393] .icon span {\n\t\tposition: relative;\n\t\ttop: -0.16em;\n\t\tfont-weight: 400;\n\t}\n\n\tul[svelte-3688487393], [svelte-3688487393] ul {\n\t\tmargin: 0;\n\t\tpadding: 0;\n\t}\n\n\tli[svelte-3688487393], [svelte-3688487393] li {\n\t\tdisplay: inline-block;\n\t\tpadding: 0 0.2em;\n\t}\n\n\t[svelte-3688487393].about, [svelte-3688487393] .about {\n\t\tfloat: right;\n\t}\n\n\t@media (min-width: 400px) {\n\t\t[svelte-3688487393].icon, [svelte-3688487393] .icon {\n\t\t\tmargin: 0 1em 0 0;\n\t\t}\n\n\t\tli[svelte-3688487393], [svelte-3688487393] li {\n\t\t\tdisplay: inline-block;\n\t\t\tpadding: 0 0.5em;\n\t\t}\n\t}\n\n\t[svelte-3688487393].selected, [svelte-3688487393] .selected {\n\t\tposition: relative;\n\t\tfont-weight: 900;\n\t\tdisplay: inline-block;\n\t}\n\n\t[svelte-3688487393].selected::after, [svelte-3688487393] .selected::after {\n\t\tposition: absolute;\n\t\tcontent: '';\n\t\twidth: 100%;\n\t\theight: 2px;\n\t\tbackground-color: white;\n\t\tdisplay: block;\n\t\tbottom: -1em;\n\t}\n\n\ta[svelte-3688487393], [svelte-3688487393] a {\n\t\tcolor: white;\n\t\ttext-decoration: none;\n\t}\n",
		map: null // TODO
	});
	
	return {
		css: components.map( x => x.css ).join( '\n' ),
		map: null,
		components
	};
};

module.exports = Nav;
