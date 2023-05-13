import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyC9inJkiHwGTBj730HGd8okUczT2cqSnEs",
    authDomain: "instagram-clone-698b4.firebaseapp.com",
    projectId: "instagram-clone-698b4",
    storageBucket: "instagram-clone-698b4.appspot.com",
    messagingSenderId: "1055044574191",
    appId: "1:1055044574191:web:1995fda8d7b2cddacab41a",
    measurementId: "G-YZRFXP3BKJ"
};

firebase.initializeApp(firebaseConfig)

const db = firebase.firestore();

const auth = firebase.auth();

export {
    db, auth
}