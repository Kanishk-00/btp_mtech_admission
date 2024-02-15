// const express = require("express");
// const app = express();
// var cors = require("cors");
// // const { CorsOptions } = require("cors");
// const cookieSession = require("cookie-session");
// const port = 4444;
// const initialiseDatabaseRoutes = require("./routes/initialiseDatabase");
// const seatMatrixRoutes = require("./routes/seatMatrix");
// const roundsRoutes = require("./routes/rounds");
// const searchCandidatesRoutes = require("./routes/searchCandidates");
// const manualUpdate = require("./routes/manualUpdate");
// const mysql = require("mysql");
// const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
// const dbModels = require("./models"); // Import your database models here

// app.use(bodyParser.json());
// app.use(cookieParser());
// app.use(
//   cookieSession({
//     name: "kanishk-session",
//     keys: ["COOKIE_SECRET"], // should use as secret environment variable
//     httpOnly: true,
//     sameSite: "strict",
//   })
// );

// require("dotenv").config();
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use("/api/initialise", initialiseDatabaseRoutes);
// app.use("/api/seatMatrix", seatMatrixRoutes);
// app.use("/api/rounds", roundsRoutes);
// app.use("/api/search", searchCandidatesRoutes);
// app.use("/api/candidate", manualUpdate);

// // routes
// require("../BTP_Backend/routes/auth.routes")(app);
// require("../BTP_Backend/routes/user.routes")(app);

// // const corsOptions = {
// //   origin: "http://localhost:3000", // Allow requests from this origin
// //   credentials: true, // Allow cookies to be sent with requests
// // };

// // app.use(cors(corsOptions));

// app.get("/", (req, res) => {
//   res.send("Home page of Mtech Application site!");
// });

// const db = require("../BTP_Backend/models");
// const Role = db.role;
// // db.sequelize.sync();

// // initial();

// // When setting the cookie
// // app.get("/set-cookie", (req, res) => {
// //   // Assuming you're setting the accessToken cookie
// //   const accessToken = "your-access-token-value";

// //   res.cookie("accessToken", accessToken, {
// //     httpOnly: true,
// //     secure: false,
// //     sameSite: "none",
// //     maxAge: 15 * 60 * 1000,
// //   });

// //   res.send("Cookie set successfully");
// // });

// function initial() {
//   Role.create({
//     id: 1,
//     name: "user",
//   });

//   Role.create({
//     id: 2,
//     name: "moderator",
//   });

//   Role.create({
//     id: 3,
//     name: "admin",
//   });
// }

// app.listen(port, () => {
//   console.log(process.env.MYSQL_ROOT_PASSWORD);
//   console.log(process.env.MYSQL_DATABASE);
//   console.log(process.env.MYSQL_PASSWORD);
//   console.log(process.env.MYSQL_HOSTNAME);
//   console.log(`Server is running on port ${port}.`);
// });

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
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/initialise", initialiseDatabaseRoutes);
app.use("/api/seatMatrix", seatMatrixRoutes);
app.use("/api/rounds", roundsRoutes);
app.use("/api/search", searchCandidatesRoutes);
app.use("/api/candidate", manualUpdate);
app.use(
  cors({
    origin: "http://localhost:3000", // Set the allowed origin
    credentials: true, // Allow cookies with requests
  })
);

app.use("/admin", adminRoutes);
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
