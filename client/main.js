import roadtrip from 'roadtrip';
import { getItem, getUser, getPage } from './store.js';
import Item from '../shared/routes/Item.html';
import List from '../shared/routes/List.html';
import User from '../shared/routes/User.html';
import Nav from '../shared/components/Nav.html';
import lists from '../shared/lists.js';

const header = document.querySelector( 'header' );
const main = document.querySelector( 'main' );

const nav = new Nav({
	target: ( header.innerHTML = '', header )
});

let view;

roadtrip.add( '/', {
	enter () {
		roadtrip.goto( '/top/1' );
	}
});

// lists
lists.forEach( list => {
	roadtrip.add( `/${list.type}/:page`, {
		enter ( route ) {
			nav.set({ route: list.type });

			// we don't actually need to do anything, because the page
			// is completely static. This may change in a future version
			// (i.e. if we subscribe to realtime updates)
			if ( route.isInitial ) return;

			document.title = 'Svelte Hacker News';

			return getPage( list.type, route.params.page ).then( data => {
				if ( view ) {
					view.destroy();
				} else {
					main.innerHTML = '';
				}

				main.classList.remove( 'loading' );

				view = new List({
					target: main,
					data
				});

				window.scrollTo( route.scrollX, route.scrollY );
			});
		},
		leave () {
			main.classList.add( 'loading' );
		}
	});
});

// items
roadtrip.add( '/item/:id', {
	enter ( route ) {
		return getItem( route.params.id ).then( item => {
			document.title = item.title;

			nav.set({ route: 'item' });

			if ( view ) {
				view.destroy();
			} else {
				main.innerHTML = '';
			}

			main.classList.remove( 'loading' );

			view = new Item({
				target: main,
				data: {
					item,
					loading: true,
					scrollY: route.scrollY
				}
			});

			window.scrollTo( route.scrollX, route.scrollY );
		});
	},
	leave () {
		main.classList.add( 'loading' );
	}
});

// users
roadtrip.add( '/user/:id', {
	enter ( route ) {
		return getUser( route.params.id ).then( user => {
			nav.set({ route: 'user' });

			if ( route.isInitial ) return; // see note above

			document.title = `Profile: ${user.id} | Svelte Hacker News`;

			if ( view ) {
				view.destroy();
			} else {
				main.innerHTML = '';
			}

			main.classList.remove( 'loading' );

			view = new User({
				target: main,
				data: {
					user
				}
			});

			window.scrollTo( route.scrollX, route.scrollY );
		});
	},
	leave () {
		main.classList.add( 'loading' );
	}
});

roadtrip.start();