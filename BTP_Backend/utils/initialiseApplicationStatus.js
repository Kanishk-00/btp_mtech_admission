var {createTable}=require("./sqlqueries.js");
var {applicantsStatusSchema}=require("../schemas/applicantsStatus.js");
var mysql = require('mysql2');
/*
    Name: initializeAppicantsStatus
    Input : database name
    output: void
    Functionality :creates applicationStatus table.
*/

async function initializeAppicantsStatus(databaseName) {
    var con =mysql.createPool({
        host: process.env.MYSQL_HOSTNAME,
        user: "root",
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    }).promise();
    // console.log(applicantsStatusSchema);
    try {
        const x= await createTable(con,"applicationStatus",applicantsStatusSchema);
        
    } catch (error) {
        console.log(error)
    }

}
module.exports={initializeAppicantsStatus};
