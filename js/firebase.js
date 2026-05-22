// Firebase configuration and initialization.
// Replace the placeholder values with your own Firebase project credentials.
const firebaseConfig = {
  apiKey: "AIzaSyAHwiEjcUI_9f-LBuU3HNrI9PvhJ9c8jNA",
  authDomain: "portifolio-1d385.firebaseapp.com",
  projectId: "portifolio-1d385",
  storageBucket: "portifolio-1d385.firebasestorage.app",
  messagingSenderId: "525445438962",
  appId: "1:525445438962:web:23e29aecb293a389565f6b"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

window.firebaseConfig = firebaseConfig;
window.auth = auth;
window.db = db;
window.storage = storage;
