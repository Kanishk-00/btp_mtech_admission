import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  makeStyles,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import {
  LockOutlined as LockOutlinedIcon,
  Visibility,
  VisibilityOff,
} from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function LoginForm() {
  const classes = useStyles();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    // Validate inputs
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // Make API call to check admin status
      const response = await axios.post(
        "http://localhost:4444/api/admin/checkAdmin",
        {
          username,
          password,
        },
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        }
      );

      if (response.data.isAdmin) {
        // If user is admin, redirect to '/admin' route
        navigate("/admin");
        return;
      }

      // Handle login for non-admin users
      // Make API call to login
      const loginResponse = await axios.post(
        "http://localhost:4444/auth/login",
        {
          username,
          password,
          branch: isAdmin ? "admin" : branch, // Set branch to "admin" if isAdmin is true
        },
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        }
      );

      if (loginResponse.status !== 200) {
        throw new Error("Invalid credentials");
      }

      // Handle successful login
      console.log("Login successful. JWT token:", loginResponse.data.token);
      // Show toast message
      toast.success("You are logged in successfully.");
      // Redirect to home page
      navigate("/home");
    } catch (error) {
      // Handle login error
      console.error("Login failed:", error.message);
      setError("Invalid username or password.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} className={classes.paper}>
        <LockOutlinedIcon color="primary" fontSize="large" />
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControl variant="outlined" margin="normal" fullWidth>
            <InputLabel>Branch</InputLabel>
            <Select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              label="Branch"
              disabled={isAdmin} // Disable the Branch field if isAdmin is true
            >
              <MenuItem value={"CSE"}>CSE</MenuItem>
              <MenuItem value={"EE"}>EE</MenuItem>
              <MenuItem value={"ME"}>ME</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                color="primary"
              />
            }
            label="Are you an admin?"
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default LoginForm;

//
