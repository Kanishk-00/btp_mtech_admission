import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    // Sending the login request to the backend API
    fetch("http://localhost:4444/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Invalid credentials");
        }
        // Reset form fields
        setUsername("");
        setPassword("");
        setOpenSnackbar(true);
        // Redirect to "/" route upon successful authentication
        navigate("/");
        return response.json(); // Parse response body as JSON
      })
      .then((data) => {
        const { id, username, email, roles, token } = data;
        console.log({
          id,
          username,
          email,
          roles,
          token,
        });
      })
      .catch((error) => {
        console.error("Error logging in:", error.message);
        // You can handle login error here, like displaying an error message to the user
      });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box>
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={handleLogin}>
        Login
      </Button>

      {/* Snackbar for displaying success message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity="success"
        >
          Login successful! You are now authenticated.
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}

export default Login;
