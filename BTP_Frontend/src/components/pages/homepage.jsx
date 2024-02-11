import React, { useState } from "react";
import { Tabs, Tab, Paper, Typography, Box, Container } from "@mui/material";
import { PersonAdd, LockOpen } from "@mui/icons-material";
import Signup from "../../authentication/signup";
import Login from "../../authentication/login";

function Homepage() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{ width: "80%", maxWidth: 400, padding: 4, textAlign: "center" }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome
        </Typography>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab icon={<PersonAdd />} label="Sign Up" />
          <Tab icon={<LockOpen />} label="Login" />
        </Tabs>
        <TabPanel value={tabIndex} index={0}>
          <Signup />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <Login />
        </TabPanel>
      </Paper>
    </Container>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default Homepage;
