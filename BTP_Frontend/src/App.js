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
import { useState } from "react";

function App() {
  const [isAdmin, setIsAdmin] = useState(true);
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
        {/* <div className="min-h-[100vh]">
            <Routes>
              <Route path="/" element={<LoginForm />}></Route>
              <ProtectedRoute path="/initialise" element={<Initialise />} />
              <ProtectedRoute path="/seatmatrix" element={<SeatMatrix />} />
              <ProtectedRoute path="/rounds" element={<Rounds />} />
              <ProtectedRoute path="/search" element={<FilterOptions />} />
              <ProtectedRoute
                path="/search/:coapid"
                element={<CandidateDisplay />}
              />
              <ProtectedRoute path="/home" element={<Home />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="*" element={<Navigate to="/" />} />{" "}
              {/* Redirect to login page if route not found */}
        {/* </Routes> */}
        {/* </div>  */}
        <Footer />
      </div>
    </div>
  );
}
// <Footer/>
export default App;
