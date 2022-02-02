import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/database"


const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
    databseURL: `https://${process.env.REACT_APP_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
}

function initFirebase() {
    if (!firebase.apps.length) {
        firebase.initializeApp(config)
    }
}

initFirebase();

export { firebase };