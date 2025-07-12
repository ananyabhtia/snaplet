// Add a second document with a generated ID.
import { addDoc, collection } from "firebase/firestore"; 
import { db } from "./firebaseConfig.js";
import { useEffect } from "react";

export default function TestFirestore() {
  useEffect(() => {
    async function runFirestoreTest() {
      try {
        const docRef = await addDoc(collection(db, "users"), {
          first: "Ada",
          last: "Lovelace",
          born: 1815
        });
        console.log("beep");
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }

      try {
        const docRef = await addDoc(collection(db, "users"), {
          first: "Alan",
          middle: "Mathison",
          last: "Turing",
          born: 1912
        });
        console.log("boop");
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
    runFirestoreTest();
  }, []);
  return <div>Check the console for Firestore test output.</div>;
}