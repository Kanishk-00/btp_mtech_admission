// homepage.jsx

import React from "react";
import { Box, Grid } from "@chakra-ui/react";
import Login from "../../authentication/login";

const Homepage = () => {
  return (
    <Box p={4}>
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <Login />
        <Login />
      </Grid>
    </Box>
  );
};

export default Homepage;
