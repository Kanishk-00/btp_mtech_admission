const mysql = require("mysql2");
const { createTable } = require("./sqlqueries.js");
const { applicantsStatusSchema } = require("../schemas/applicantsStatus.js");

async function initializeAppicantsStatus(branch, databaseName) {
  var con = mysql
    .createPool({
      host: process.env.MYSQL_HOSTNAME,
      user: "root",
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    })
    .promise();

  try {
    const schema = applicantsStatusSchema(branch);
    console.log("Creating table with schema:", schema);
    const x = await createTable(con, `${branch}_applicationStatus`, schema);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { initializeAppicantsStatus };
