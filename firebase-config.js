const firebaseConfig = {
  apiKey: "AIzaSyBzxmeM4xeZK8S897l-troTlhyb9LAG-4A",
  authDomain: "enquete-app-afa39.firebaseapp.com",
  projectId: "enquete-app-afa39",
  storageBucket: "enquete-app-afa39.firebasestorage.app",
  messagingSenderId: "9596134822",
  appId: "1:9596134822:web:5e39a1ff2910a8da685b67"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();