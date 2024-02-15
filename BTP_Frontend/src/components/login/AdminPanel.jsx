import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
import { AddCircle, Visibility, VisibilityOff } from "@material-ui/icons";
import { Snackbar } from "@material-ui/core";

function AdminPanel() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = () => {
    // Validate inputs
    if (!username || !password || !branch) {
      setError("Please fill in all fields.");
      return;
    }

    // Make API call to register user
    fetch("http://localhost:4444/admin/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        branch,
      }),
    })
      .then((response) => {
        if (response.ok) {
          // User successfully registered
          console.log("User registered successfully:", {
            username,
            password,
            branch,
          });
          // Clear form fields
          setUsername("");
          setPassword("");
          setBranch("");
          setError("");
          // Show success message
          //   alert("User created successfully!");
          setOpenSnackbar(true);
        } else {
          // Error registering user
          return response.json().then((data) => {
            setError(data.error || "Failed to register user.");
          });
        }
      })
      .catch((error) => {
        setError("Failed to register user. Please try again later.");
        console.error("Error registering user:", error);
      });
  };

  return (
    <Container maxWidth="sm" style={{ height: "100vh" }}>
      <Grid
        container
        spacing={2}
        alignItems="center"
        justify="center"
        style={{ height: "100%" }}
      >
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom align="center">
            Admin Panel
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: 20 }}>
            <Typography variant="h6" gutterBottom align="center">
              Add User
            </Typography>
            {error && (
              <Typography variant="body2" color="error" align="center">
                {error}
              </Typography>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Branch</InputLabel>
                  <Select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  >
                    <MenuItem value={"CSE"}>CSE</MenuItem>
                    <MenuItem value={"EE"}>EE</MenuItem>
                    <MenuItem value={"ME"}>ME</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircle />}
                  onClick={handleSubmit}
                  fullWidth
                >
                  Add User
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          message="User created successfully!"
        />
      </Grid>
    </Container>
  );
}

export default AdminPanel;
