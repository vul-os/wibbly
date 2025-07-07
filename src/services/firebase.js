// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4dLbN6JCoYHrEPO9qZ1F07HSHzH0LtkE",
  authDomain: "wibbly-io.firebaseapp.com",
  projectId: "wibbly-io",
  storageBucket: "wibbly-io.firebasestorage.app",
  messagingSenderId: "68139051153",
  appId: "1:68139051153:web:153693ba1fc90883ddf730",
  measurementId: "G-8QN9WVGRCR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export analytics for use in other parts of the app
export { analytics };