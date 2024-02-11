// src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:4444/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        // Store the token in localStorage or a secure storage mechanism
        localStorage.setItem("token", token);
        navigate("/dashboard");
      } else {
        // Handle login error
        console.error("Login failed");
      }
    } catch (error) {
      console.error(error);
      // Handle other errors
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md p-4 bg-white rounded shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          className="mt-4 bg-blue-500 text-white hover:bg-blue-700"
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default Login;
