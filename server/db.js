const Firebase = require( 'firebase' );

Firebase.initializeApp({
	databaseURL: 'https://hacker-news.firebaseio.com'
});

module.exports = Firebase.database().ref( 'v0' );