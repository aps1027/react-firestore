import firebase from 'firebase';

const settings = {timestampsInSnapshots: true};

// add file store config
var config = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  };
firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;