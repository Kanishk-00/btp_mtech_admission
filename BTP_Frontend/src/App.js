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

  // useEffect(() => {
  //   async function fetchAdminStatus() {
  //     try {
  //       const response = await axios.post(
  //         "http://localhost:4444/api/admin/checkAdmin",
  //         {
  //           username: "username_here", // Replace with actual username
  //           password: "password_here", // Replace with actual password
  //         },
  //         { withCredentials: true }
  //       );
  //       setIsAdmin(response.data.isAdmin);
  //     } catch (error) {
  //       setIsAdmin(false); // Set isAdmin to false if there's an error or if user is not admin
  //       console.error("Error fetching admin status:", error);
  //     }
  //   }

  //   fetchAdminStatus();
  // }, []);

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
            <Route
              path="/search/:coapid"
              element={<CandidateDisplay />}
            ></Route>
            {isAdmin && <Route path="/admin" element={<AdminPanel />} />}{" "}
            <Route path="/home" element={<Home />}></Route>
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
