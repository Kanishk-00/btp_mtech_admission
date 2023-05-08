var {createTable,insertManyIntoTable}=require("./sqlqueries.js");
var {seatMatrixSchema}=require("../schemas/seatMatrixSchema.js");
var mysql = require('mysql2');
/*
    Name: initialiseSeatMatrix
    Input : database name,seat alloted data
    output: void
    Functionality :init seat matrix table.
*/
async function initialiseSeatMatrix(databaseName,seatAllotedData) {
    var con =mysql.createPool({
        host: process.env.MYSQL_HOSTNAME,
        user: "root",
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    }).promise();
    console.log(seatMatrixSchema)
    var createdTableStatus= await createTable(con,"seatMatrix",seatMatrixSchema);
    var InsertedTableStatus=await insertManyIntoTable(con,"seatMatrix",`(category,seatsAllocated)`,seatAllotedData)
}
// initialiseSeatMatrix("Applicants2019");
module.exports={initialiseSeatMatrix}
