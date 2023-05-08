const express = require('express')
const app = express();
var cors = require('cors');
const port = 4444;
const initialiseDatabaseRoutes=require("./routes/initialiseDatabase");
const seatMatrixRoutes=require("./routes/seatMatrix");
const roundsRoutes=require("./routes/rounds");
const searchCandidatesRoutes=require("./routes/searchCandidates")
const manualUpdate=require("./routes/manualUpdate")

require('dotenv').config()
app.use(cors());
app.use(express.json());
app.use("/api/initialise", initialiseDatabaseRoutes);
app.use("/api/seatMatrix",seatMatrixRoutes );
app.use("/api/rounds", roundsRoutes);
app.use("/api/search", searchCandidatesRoutes);
app.use("/api/candidate", manualUpdate);

app.get('/', (req, res) => {
  res.send('Home page of Mtech Application site!');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})