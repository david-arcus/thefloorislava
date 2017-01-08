import * as firebase from "firebase";

const config = {
  apiKey: "AIzaSyD7bOjrVqYu1ezayVBxC4J7jjIkQcDxsWk",
  authDomain: "the-floor-is-lava-1ce40.firebaseapp.com",
  databaseURL: "https://the-floor-is-lava-1ce40.firebaseio.com",
  storageBucket: "the-floor-is-lava-1ce40.appspot.com",
  messagingSenderId: "497275033652"
};

const FirebaseApp = firebase.initializeApp(config);


module.exports.FirebaseApp = FirebaseApp;
