import "./App.css";
import NavBar from "./components/NavBar";
import "./input.css";
import { Routes, Route } from "react-router-dom";
import Initialise from "./components/initialisationComponents/Initialise";
import SeatMatrix from "./components/seatMatrix/SeatMatrix.jsx";
import Footer from "./components/Footer";
import Rounds from "./components/rounds/Rounds";
import Home from "./components/Home";
import FilterOptions from "./components/search/FilterOptions";
import CandidateDisplay from "./components/candidatePage/CandidateDisplay";
import Homepage from "./components/pages/homepage.jsx";
function App() {
  return (
    <div className="App flex-col gap-14 h-full">
      <NavBar />
      <div className="min-h-[100vh]">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/initialise" element={<Initialise />}></Route>
          <Route path="/seatmatrix" element={<SeatMatrix />}></Route>
          <Route path="/rounds" element={<Rounds />}></Route>
          <Route path="/search" element={<FilterOptions />}></Route>
          <Route path="/search/:coapid" element={<CandidateDisplay />}></Route>
          <Route path="/home" element={<Homepage />} />{" "}
        </Routes>
      </div>

      <Footer />
    </div>
  );
}
// <Footer/>
export default App;
