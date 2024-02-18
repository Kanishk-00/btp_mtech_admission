const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
var cors = require("cors");
const port = 4444;
const initialiseDatabaseRoutes = require("./routes/initialiseDatabase");
const seatMatrixRoutes = require("./routes/seatMatrix");
const roundsRoutes = require("./routes/rounds");
const searchCandidatesRoutes = require("./routes/searchCandidates");
const manualUpdate = require("./routes/manualUpdate");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config();
// app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: function (origin, callback) {
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

// app.use(
//   cors({
//     origin: "*", // Set the allowed origin
//     credentials: true, // Allow cookies with requests
//     // "Access-Control-Allow-Origin": "http://10.196.41.66:3000",
//     // "Access-Control-Allow-Origin": "http://10.196.41.66:3000",
//     optionSuccessStatus: 200,
//   })
// );

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/initialise", initialiseDatabaseRoutes);
app.use("/api/seatMatrix", seatMatrixRoutes);
app.use("/api/rounds", roundsRoutes);
app.use("/api/search", searchCandidatesRoutes);
app.use("/api/candidate", manualUpdate);
app.use("/admin", adminRoutes);

// Apply authentication middleware to all routes except authRoutes
// app.use((req, res, next) => {
//   if (req.path.startsWith("/auth")) {
//     // Skip authentication for authRoutes
//     next();
//   } else {
//     authMiddleware(req, res, next);
//   }
// });

// app.use(function (request, response, next) {
//   response.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   response.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// // CORS preflight handling for specific route
// app.options("/api/initialise/getMasterFileUploadStatus", (req, res) => {
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With, Content-Type"
//   );
//   res.sendStatus(200);
// });
// app.use("/api/initialise", initialiseDatabaseRoutes);
// app.use("/api/seatMatrix", seatMatrixRoutes);
// app.use("/api/rounds", roundsRoutes);
// app.use("/api/search", searchCandidatesRoutes);
// app.use("/api/candidate", manualUpdate);

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Home page of Mtech Application site!");
});

app.listen(port, () => {
  console.log(process.env.MYSQL_ROOT_PASSWORD);
  console.log(process.env.MYSQL_DATABASE);
  console.log(process.env.MYSQL_PASSWORD);
  console.log(process.env.MYSQL_HOSTNAME);

  console.log(`Example app listening on port ${port}`);
});
