const mysql = require("mysql2");
const { createTable } = require("./sqlqueries.js");
const { applicantsStatusSchema } = require("../schemas/applicantsStatus.js");
const sqlQueries = require("./sqlqueries.js");

async function initializeApplicantsStatus(branch, databaseName) {
  try {
    // Creating a Connection
    const con = mysql
      .createPool({
        host: process.env.MYSQL_HOSTNAME,
        user: "root",
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
      })
      .promise();

    // Define table name
    const tableName = "applicationstatus";

    // Check if the table exists
    const tableExists = await sqlQueries.checkTableExists(con, tableName);
    if (!tableExists) {
      const schema = applicantsStatusSchema(branch);
      console.log("Creating table with schema:", schema);
      const createTableResult = await createTable(con, tableName, schema);
    }

    console.log(
      `Applicants status table '${tableName}' initialized successfully`
    );
  } catch (error) {
    console.error("Error:", error);
    // Handle errors appropriately
  }
}

module.exports = { initializeApplicantsStatus };
