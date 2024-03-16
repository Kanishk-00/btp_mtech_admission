const router = require("express").Router();
const isAuthenticated = require("../middleware/authMiddleware");
var { selectQuery } = require("../utils/sqlqueries");
var mysql = require("mysql2");
/*
    Route:/api/seatMatrix/seatMatrixData
    incoming data: --
    outgoing data: seat matrix table as JSON object
*/

router.get("/seatMatrixData", isAuthenticated, async (req, res) => {
  try {
    const con = mysql
      .createPool({
        host: process.env.MYSQL_HOSTNAME,
        user: "root",
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
      })
      .promise();

    const branch = req.user.branch;

    const query = `SELECT category, seatsAllocated,
        (SELECT COUNT(*) FROM applicationstatus WHERE (accepted='Y' OR accepted='R') AND offercat=category AND branch='${req.user.branch}') AS seatsBooked
        FROM seatMatrix WHERE branch='${req.user.branch}';`;

    const [resultSeatMatrix] = await con.query(query);
    res.status(200).send({ result: resultSeatMatrix });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send({ result: "Error retrieving seat matrix data" });
  }
});
/*
    Route:/api/seatMatrix/seatMatrixData
    incoming data: --
    outgoing data: 200 if successfully updated
    functionality:updates the seats allocated to a particular category 
*/
router.post("/updateSeats", isAuthenticated, async (req, res) => {
  try {
    const con = mysql
      .createPool({
        host: process.env.MYSQL_HOSTNAME,
        user: "root",
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
      })
      .promise();

    const branch = req.user.branch;

    const query = `UPDATE seatMatrix SET SeatsAllocated=${req.body.seats} WHERE Category='${req.body.category}' AND branch = '${req.user.branch}'`;

    const [resultSeatMatrix] = await con.query(query);
    res.status(200).send({ result: resultSeatMatrix });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send({ result: "Error updating seats" });
  }
});

module.exports = router;
