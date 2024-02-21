import "./App.css";
import NavBar from "./components/NavBar";
import "./input.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Initialise from "./components/initialisationComponents/Initialise";
import SeatMatrix from "./components/seatMatrix/SeatMatrix.jsx";
import Footer from "./components/Footer";
import Rounds from "./components/rounds/Rounds";
import Home from "./components/Home";
import FilterOptions from "./components/search/FilterOptions";
import CandidateDisplay from "./components/candidatePage/CandidateDisplay";
import AdminPanel from "./components/login/AdminPanel.jsx";
import LoginForm from "./components/login/LoginForm.jsx";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [isAdmin, setIsAdmin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <div>
      <div className="App flex-col gap-14 h-full">
        <NavBar />
        <div className="min-h-[100vh]">
          <Routes>
            <Route path="/" element={<LoginForm />}></Route>
            <Route path="/initialise" element={<Initialise />}></Route>
            <Route path="/seatmatrix" element={<SeatMatrix />}></Route>
            <Route path="/rounds" element={<Rounds />}></Route>
            <Route path="/search" element={<FilterOptions />}></Route>
            <Route path="/home" element={<Home />}></Route>
            <Route
              path="/search/:coapid"
              element={<CandidateDisplay />}
            ></Route>
            {isAdmin && <Route path="/admin" element={<AdminPanel />} />}{" "}
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
