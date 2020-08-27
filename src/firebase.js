import firebase from "firebase";

const firebaseApp = firebase.initializeApp ({
    apiKey: "AIzaSyA5cdw1CTrGNZt9SC3gTAhDIdjU0kJSvKA",
    authDomain: "instagram-clone-dc618.firebaseapp.com",
    databaseURL: "https://instagram-clone-dc618.firebaseio.com",
    projectId: "instagram-clone-dc618",
    storageBucket: "instagram-clone-dc618.appspot.com",
    messagingSenderId: "144373991904",
    appId: "1:144373991904:web:4f29e4ffa70c195a104385",
    measurementId: "G-TSQQLBHVP3"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

firebaseApp.serverTimestamp = firebase.firestore.FieldValue.serverTimestamp()

export {db, auth, storage}