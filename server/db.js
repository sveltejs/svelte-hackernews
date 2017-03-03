import Firebase from 'firebase';
// import Database from 'firebase/database';

Firebase.initializeApp({
	databaseURL: 'https://hacker-news.firebaseio.com'
});

export default Firebase.database().ref( 'v0' );