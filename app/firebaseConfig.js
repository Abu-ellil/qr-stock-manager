import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbGq9AcqSpiSf5-_mNFrTb_TLBdlZZyf8",
  authDomain: "qrmarket-1d0a5.firebaseapp.com",
  projectId: "qrmarket-1d0a5",
  storageBucket: "qrmarket-1d0a5.appspot.com",
  messagingSenderId: "674630099487",
  appId: "1:674630099487:web:b74f5812d85696c225eb2a",
  measurementId: "G-NZCMQK9KSJ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getData(collectionName, filterField = null, filterValue = null) {
  try {
    const collectionRef = collection(db, collectionName);
    let q;

    if (filterField && filterValue) {
      // Build a query with filtering if provided
      q = query(collectionRef, where(filterField, "==", filterValue));
    } else {
      // Get all documents if no filter is applied
      q = query(collectionRef);
    }

    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() }); // Add document ID to each data object
    });
    console.log(data);
  } catch (error) {
    console.error("Error getting documents:", error);
  }
}

async function addDataToFirestore(collectionName, data) {
  try {
    const collectionRef = collection(db, collectionName); // Reference a specific collection
    const docRef = await addDoc(collectionRef, data); // Add the data
    console.log("Document written with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding document:", error);
  }
}



export { getFirestore, collection, addDoc, query, where, getDocs,db,app };
