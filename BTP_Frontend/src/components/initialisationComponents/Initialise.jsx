import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import FileUploader from "./FileUploader";
import MatchColumns from "./MatchColumns";
import { serverLink } from "../../serverLink";
import axios from "axios";

function Initialise(props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("hits useeffect");
    const checkAuthentication = async () => {
      try {
        const authResponse = await axios.get(
          "http://localhost:4444/api/check-authentication",
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        console.log("authresponse is here: ", authResponse);

        setIsAuthenticated(authResponse.data.isAuthenticated);
        setLoading(false);
      } catch (error) {
        console.log("Error:", error);
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  // Function to call server to reset database
  const handleReset = async () => {
    try {
      const jwtToken = getCookie("jwtToken"); // Get JWT token from cookie

      // Check if user is authenticated
      if (!isAuthenticated) {
        alert("User is not authenticated");
        return;
      }

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

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("isUTH", isAuthenticated);

  if (!isAuthenticated) {
    return (
      <div>
        Hello this is the page to be displayed when the user is not logged in
      </div>
    ); // Or you can return a message like "You are not authenticated"
  }

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
