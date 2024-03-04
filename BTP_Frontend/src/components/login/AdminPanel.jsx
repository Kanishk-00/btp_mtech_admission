import React, { useState, useEffect } from "react";
import DeleteIcon from "@material-ui/icons/Delete";

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
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  InputAdornment,
  Snackbar,
} from "@material-ui/core";
import { AddCircle, Visibility, VisibilityOff } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminPanel() {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("");
  const [programs, setProgramDropdown] = useState([]);
  const [error, setError] = useState("");
  const [newProgram, setNewProgram] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [openCreateSnackbar, setOpenCreateSnackbar] = useState(false);
  const [openDeleteSnackbar, setOpenDeleteSnackbar] = useState(false);
  const [openUpdateSnackbar, setOpenUpdateSnackbar] = useState(false);
  const [newPasswordMap, setNewPasswordMap] = useState({}); // State to track new passwords for each user
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users on component mount
    fetch("http://localhost:4444/admin/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
    fetchPrograms();
    const checkAuthentication = async () => {
      const jwtToken = getCookie("jwtToken");
      try {
        const response = await axios.get(
          `http://localhost:4444/api/check-authentication/`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        console.log("the response is: ", response.data);
        if (!response.data.isAdmin) {
          // alert("You need to be an admin to access admin console");
          navigate("/home");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log("User is not authenticated. Navigating to '/'...");
          navigate("/");
        } else {
          console.error("Error checking authentication:", error);
        }
      }
    };
    checkAuthentication();
  }, []);

  const handleDeleteUser = (userId) => {
    // Delete user by ID
    fetch(`http://localhost:4444/admin/users/${userId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // User deleted successfully
          console.log("User deleted successfully:", userId);
          // Remove the user from the state
          setUsers(users.filter((user) => user.id !== userId));
          setOpenDeleteSnackbar(true);
        } else {
          // Error deleting user
          return response.json().then((data) => {
            console.error("Error deleting user:", data.error);
          });
        }
      })
      .catch((error) => console.error("Error deleting user:", error));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleNewProgram = () => {
    console.log(newProgram);
    fetch("http://localhost:4444/admin/addProgram", {
    method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newProgram,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("New program added successfully");
          fetchPrograms();
        } else {
          // Error registering user
          return response.json().then((data) => {
            setError(data.error || "Failed to add new program.");
          });
        }
      })
      .catch((error) => {
        setError("Failed to add new program Please try again later.");
      });
  };

  const handleSubmit = () => {
    // Validate inputs
    if (!username || !password || !branch) {
      setError("Please fill in all fields.");
      return;
    }

    // Check if username is 'admin'
    if (username.toLowerCase() === "admin") {
      setError("You can't add a user with the username 'admin'.");
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
          fetchUsers();
          setOpenCreateSnackbar(true);
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

  const fetchUsers = () => {
    // Fetch updated list of users
    fetch("http://localhost:4444/admin/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  };

  const fetchPrograms = () => {
    // Fetch updated list of users
    fetch("http://localhost:4444/admin/branches")
      .then((response) => response.json())
      .then((data) => {setProgramDropdown(data)})
      .catch((error) => console.error("Error fetching branches:", error));
    };
  

  const handleNewPasswordChange = (userId, newPassword) => {
    setNewPasswordMap((prevMap) => ({
      ...prevMap,
      [userId]: newPassword,
    }));
  };

  const handleUpdatePassword = (userId) => {
    const newPassword = newPasswordMap[userId];

    // Validate new password
    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    // Make API call to update password
    fetch(`http://localhost:4444/admin/users/${userId}/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newPassword,
      }),
    })
      .then((response) => {
        if (response.ok) {
          // Password updated successfully
          console.log("Password updated successfully for user:", userId);
          // Clear new password field
          setNewPasswordMap((prevMap) => ({
            ...prevMap,
            [userId]: "",
          }));
          // Show success message
          setOpenUpdateSnackbar(true);
        } else {
          // Error updating password
          return response.json().then((data) => {
            setError(data.error || "Failed to update password.");
          });
        }
      })
      .catch((error) => {
        setError("Failed to update password. Please try again later.");
        console.error("Error updating password:", error);
      });
  };

  return (
    <Container maxWidth="md" style={{ height: "100vh" }}>
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
          <Paper
            elevation={3}
            style={{ padding: 20, maxWidth: "70%", margin: "0 auto" }}
          >
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
                <Snackbar
                  open={
                    error === "You can't add a user with the username 'admin'."
                  }
                  autoHideDuration={6000}
                  onClose={() => setError("")}
                  message="You can't add admin"
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
                   {programs.map(program => (
                    <MenuItem key={program.branch} value={program.branch} >{program.branch}</MenuItem>
                    ))}
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                {branch === 'Other' && (
                  <div>
                    <TextField
                      label="Enter new program"
                      value={newProgram}
                      onChange={(e) => setNewProgram(e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={handleNewProgram}>
                      Add
                    </Button>
                  </div>
      )}
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

        {/* User View Section*/}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            style={{
              padding: 20,
              marginTop: 20,
              maxHeight: "calc(100vh - 480px)",
              maxWidth: "100%",
              overflowY: "auto",
            }}
          >
            <Typography variant="h6" gutterBottom align="center">
              Added Users
            </Typography>
            {error && (
              <Typography variant="body2" color="error" align="center">
                {error}
              </Typography>
            )}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Branch</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>New Password</TableCell> {/* New column */}
                    <TableCell>Update</TableCell> {/* New column */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.branch}</TableCell>
                      {user.isAdmin ? (
                        <TableCell></TableCell>
                      ) : (
                        <TableCell>
                          <IconButton
                            onClick={() => handleDeleteUser(user.id)}
                            color="secondary"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      )}
                      <TableCell>
                        <TextField
                          type="password"
                          value={newPasswordMap[user.id] || ""}
                          onChange={(e) =>
                            handleNewPasswordChange(user.id, e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleUpdatePassword(user.id)}
                        >
                          Update Password
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Snackbar
          open={openCreateSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenCreateSnackbar(false)}
          message="User created successfully!"
        />
      </Grid>

      <Snackbar
        open={openUpdateSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenUpdateSnackbar(false)}
        message="Password updated successfully!"
      />

      <Snackbar
        open={openDeleteSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenDeleteSnackbar(false)}
        message="User Deleted successfully!"
      />
    </Container>
  );
}

export default AdminPanel;

//
