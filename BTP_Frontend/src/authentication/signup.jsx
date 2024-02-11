import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSignup = () => {
    // Frontend validation
    let newError = {};
    if (!username.trim()) {
      newError.username = "Username is required";
    }
    if (!email.trim()) {
      newError.email = "Email is required";
    }
    if (!password.trim()) {
      newError.password = "Password is required";
    }
    if (!confirmPassword.trim()) {
      newError.confirmPassword = "Please confirm your password";
    }
    if (password !== confirmPassword) {
      newError.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newError).length === 0) {
      // If no errors, proceed with signup logic
      const requestBody = {
        username,
        email,
        password,
        roles: [role],
      };

      // Sending the signup request to the backend API
      fetch("http://localhost:4444/api/auth/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error signing up");
          }
          // Reset form fields
          setUsername("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setRole("user");
          setOpenSnackbar(true);
        })
        .catch((error) => {
          console.error("Error signing up:", error.message);
          // You can handle signup error here, like displaying an error message to the user
        });
    } else {
      setError(newError);
    }
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
        error={Boolean(error.username)}
        helperText={error.username}
      />
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
        error={Boolean(error.email)}
        helperText={error.email}
      />
      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
        error={Boolean(error.password)}
        helperText={error.password}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleTogglePasswordVisibility}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="Confirm Password"
        type={showConfirmPassword ? "text" : "password"}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
        margin="normal"
        error={Boolean(error.confirmPassword)}
        helperText={error.confirmPassword}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleToggleConfirmPasswordVisibility}>
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        select
        label="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        fullWidth
        margin="normal"
      >
        <MenuItem value="user">User</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
      </TextField>
      <Button variant="contained" onClick={handleSignup}>
        Sign Up
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
          Sign up successful! You are now authenticated.
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}

export default Signup;
