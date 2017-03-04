import Firebase from 'firebase';

Firebase.initializeApp({
	databaseURL: 'https://hacker-news.firebaseio.com'
});

export default Firebase.database().ref( 'v0' );