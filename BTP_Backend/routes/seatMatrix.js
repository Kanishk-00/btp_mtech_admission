const router = require("express").Router();
var {selectQuery}=require("../utils/sqlqueries");
var mysql = require('mysql2');
/*
    Route:/api/seatMatrix/seatMatrixData
    incoming data: --
    outgoing data: seat matrix table as JSON object
*/ 
router.get("/seatMatrixData", async (req, res) => {
    //connecting to database
   try {
        var con =mysql.createPool({
            host: process.env.MYSQL_HOSTNAME,
            user: "root",
            password:process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        }).promise();
    }catch (error) {
        console.log("Error connecting to the database:", error);
        res.status(500).send({"result": "Error connecting to the database"});
    }
    //quering seat matrix data
    try {
        const [resultSeatMatrix]=await con.query(`select category,seatsAllocated,
        (select count(*) from applicationstatus where (accepted='Y' or accepted='R') and offercat=category) as seatsBooked from seatmatrix;`);
        // console.log(resultSeatMatrix);
        res.status(200).send({result:resultSeatMatrix});
    } catch (error) {
        console.log(error);
        res.status(500).send({"result":"NO Table Exists"});
    }

});
/*
    Route:/api/seatMatrix/seatMatrixData
    incoming data: --
    outgoing data: 200 if successfully updated
    functionality:updates the seats allocated to a particular category 
*/ 
router.post("/updateSeats", async (req, res) => {
    try {
        var con =mysql.createPool({
        host: process.env.MYSQL_HOSTNAME,
        user: "root",
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
        }).promise();
    } catch (error) {
        console.log("Error connecting to the database:", error);
        res.status(500).send({"result": "Error connecting to the database"});
    }
    try {
        const [resultSeatMatrix]=await con.query(`UPDATE seatMatrix SET SeatsAllocated=${req.body.seats} where Category='${req.body.category}' `);
        res.status(200).send({result:resultSeatMatrix});
    } catch (error) {
        console.log(error);
        res.status(500).send({"result":"NO Table Exists"});
    }

});


module.exports = router;
