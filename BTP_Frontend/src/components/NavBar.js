import React from "react";
import "../input.css";
import iitgoalogo from "../images/Indian_Institute_of_Technology_Goa_Logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { IconButton, Tooltip } from "@material-ui/core";
import { ExitToApp as ExitToAppIcon } from "@material-ui/icons";
import axios from "axios";

function NavBar(props) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const response = await axios.get("http://localhost:4444/auth/signout", {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      console.log("response", response);
      if (response.status === 200) {
        // Remove JWT token from localStorage
        localStorage.removeItem("jwtToken");
        // Signout successful, redirect to login page
        navigate("/");
      } else {
        // Handle signout error
        console.error("Signout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <nav className="flex justify-start items-center h-20 box shadow-md  px-8 gap-8 bg-[#1B3058] w-full">
      <Link to="/home">
      <div className=" h-full flex justify-center items-center gap-2 ">
        
            <img
              src={iitgoalogo}
              alt={"not found"}
              className=" shadow-lg bg-white"
              style={{ width: "70px", height: "70px", borderRadius: "50%" }}
            ></img>
            <div className="flex justify-center items-center">
              <p className="text-xl text-white">IIT Goa</p>
            </div>
        
      </div>
      </Link>
      <div className="w-[fit-content] h-full flex justify-center items-center gap-4 ml-auto">
        <Link to="/home">
          <button className="flex h-full p-2 justify-center items-center hover:border-b-4">
            <p className="text-lg text-white">Home</p>
          </button>
        </Link>
        <Link to="/initialise">
          <button className="flex h-full p-2 justify-center items-center hover:border-b-4">
            <p className="text-lg text-white">Initialisation</p>
          </button>
        </Link>
        <Link to="/seatMatrix">
          <button className="flex h-full p-2 justify-center items-center hover:border-b-4">
            <p className="text-lg text-white">SeatMatrix</p>
          </button>
        </Link>
        <Link to="/rounds">
          <button className="flex h-full p-2 justify-center items-center hover:border-b-4">
            <p className="text-lg text-white">Rounds</p>
          </button>
        </Link>
        <Link to="/search">
          <button className="flex h-full p-2 justify-center items-center hover:border-b-4">
            <p className="text-lg text-white">Search</p>
          </button>
        </Link>
        <Tooltip title="Logout">
          <IconButton color="inherit" onClick={handleSignOut}>
            <ExitToAppIcon style={{ color: "white" }} />
          </IconButton>
        </Tooltip>
      </div>
    </nav>
  );
}

export default NavBar;
