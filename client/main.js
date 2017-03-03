import roadtrip from 'roadtrip';
import { getItem, getUser } from './store.js';
import getJSON from './utils/getJSON.js';
import Item from '../shared/routes/Item.html';
import Top from '../shared/routes/Top.html';
import User from '../shared/routes/User.html';
import Nav from '../shared/components/Nav.html';

const header = document.querySelector( 'header' );
const main = document.querySelector( 'main' );

const nav = new Nav({
	target: ( header.innerHTML = '', header )
});

let view;



roadtrip
	.add( '/', {
		enter ( route ) {
			roadtrip.goto( '/top/1' );
		}
	})
	.add( '/top/:page', {
		enter ( route ) {
			nav.set({ route: 'top' });

			document.title = 'Svelte Hacker News';

			return getJSON( `/top/${route.params.page}.json` ).then( items => {
				if ( view ) {
					view.destroy();
				} else {
					main.innerHTML = '';
				}

				view = new Top({
					target: main,
					data: {
						items
					}
				});
			});
		}
	})
	.add( '/newest', {
		enter ( route ) {
			nav.set({ route: 'newest' });
		}
	})
	.add( '/show', {
		enter ( route ) {
			nav.set({ route: 'show' });
		}
	})
	.add( '/ast', {
		enter ( route ) {
			nav.set({ route: 'ast' });
		}
	})
	.add( '/jobs', {
		enter ( route ) {
			nav.set({ route: 'jobs' });
		}
	})
	.add( '/user/:name', {
		enter ( route ) {
			return getUser( route.params.name ).then( user => {
				console.log( `user`, user )
				document.title = `Profile: ${user.name} | Svelte Hacker News`;

				nav.set({ route: 'user' });

				if ( view ) {
					view.destroy();
				} else {
					main.innerHTML = '';
				}

				view = new User({
					target: main,
					data: {
						user
					}
				});
			});
		}
	})
	.add( '/item/:id', {
		enter ( route ) {
			return getItem( route.params.id ).then( item => {
				document.title = item.title;

				nav.set({ route: 'item' });

				if ( view ) {
					view.destroy();
				} else {
					main.innerHTML = '';
				}

				view = new Item({
					target: main,
					data: {
						item,
						loading: true
					}
				});
			});
		}
	})
	.start();