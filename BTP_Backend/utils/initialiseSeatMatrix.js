var { createTable, insertManyIntoTable } = require("./sqlqueries.js");
var { seatMatrixSchema } = require("../schemas/seatMatrixSchema.js");
var mysql = require("mysql2");
/*
    Name: initialiseSeatMatrix
    Input : database name,seat alloted data
    output: void
    Functionality :init seat matrix table.
*/
async function initialiseSeatMatrix(branch, seatAllotedData) {
  var con = mysql
    .createPool({
      host: process.env.MYSQL_HOSTNAME,
      user: "root",
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    })
    .promise();
  console.log(seatMatrixSchema);
  const createdTableStatus = await createTable(
    con,
    `${branch}_seatMatrix`,
    seatMatrixSchema
  );

  // Inserting data into the seat matrix table
  const insertedTableStatus = await insertManyIntoTable(
    con,
    `${branch}_seatMatrix`,
    `(category, seatsAllocated)`,
    seatAllotedData
  );
}
// initialiseSeatMatrix("Applicants2019");
module.exports = { initialiseSeatMatrix };
