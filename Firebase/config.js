
import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDDL6x3nasS2aNbdztVPDb9h979H0s6wOs",
    authDomain: "goit-react-native-hw-06-ce569.firebaseapp.com",
    projectId: "goit-react-native-hw-06-ce569",
    storageBucket: "goit-react-native-hw-06-ce569.appspot.com",
    messagingSenderId: "995036384073",
    appId: "1:995036384073:web:85cc10e1b46a659ed1e898",
    measurementId: "G-TF9Y4N2DH3"
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);