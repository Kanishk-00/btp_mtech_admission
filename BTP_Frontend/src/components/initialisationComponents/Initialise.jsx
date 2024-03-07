import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import FileUploader from "./FileUploader";
import MatchColumns from "./MatchColumns";
import { serverLink } from "../../serverLink";
import axios from "axios";

function Initialise(props) {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  // Function to call server to reset database
  const handleReset = async () => {
    try {
      const jwtToken = getCookie("jwtToken"); // Get JWT token from cookie

      // Proceed with resetting database
      const response = await axios.get(
        "http://localhost:4444/api/initialise/reset",
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      window.location.reload();
    } catch (error) {
      console.log("Error:", error);
      alert(error);
    }
  };



  return (
    <div className="flex w-full justify-center flex-col items-center gap-6 p-8">
      <div className="flex  content-center justify-center w-full gap-6">
        <p className="text-3xl text-gray-400">Initialise The DataBase</p>
        <Button
          variant="outlined"
          onClick={handleReset}
          style={{ color: "white", background: "red" }}
        >
          Reset
        </Button>
      </div>
      <FileUploader />
      <div className="h-[50px] border-2"></div>
      <MatchColumns />
    </div>
  );
}

export default Initialise;
