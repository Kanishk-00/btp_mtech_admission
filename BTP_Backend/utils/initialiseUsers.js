var { createTable, insertManyIntoTable, createRoundsTable } = require("./sqlqueries.js");
var { usersSchema } = require("../schemas/usersSchema.js"); // Assuming you have a file for the users schema
var mysql = require("mysql2");

/*
    Name: initializeUsersTable
    Input: database name
    Output: void
    Functionality: creates the users table in the specified database.
*/

async function checkTableExists(connection, tableName) {
  try {
    const [rows] = await connection.query(`SHOW TABLES LIKE '${tableName}'`);
    return rows.length > 0;
  } catch (error) {
    throw error;
  }
}

async function initializeUsersTable(databaseName, userData) {
  var con = mysql
    .createPool({
      host: process.env.MYSQL_HOSTNAME,
      user: "root",
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    })
    .promise();
  console.log(usersSchema);

  try {
    const tableExists = await checkTableExists(con, "users");
    if (tableExists) {
      console.log("Users table already exists.");
      return; // Exit the function if the table exists
    }

    await createTable(con, "users", usersSchema);
    await insertManyIntoTable(
      con,
      "users",
      `(id,username, password, branch, isAdmin)`,
      userData
    );
    console.log("Users table initialized successfully.");

    
  } catch (error) {
    console.log(error);
  }
}

module.exports = { initializeUsersTable };
