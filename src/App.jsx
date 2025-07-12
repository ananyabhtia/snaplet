import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import TestFirestore from "./firestore_test";

const App = () => {
  return (
    <>
      <h1>Hello</h1>
      <TestFirestore />
    </>
  )
}

export default App
