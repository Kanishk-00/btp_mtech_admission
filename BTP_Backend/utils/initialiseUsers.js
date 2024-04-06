var { createTable, insertManyIntoTable, createRound1Table } = require("./sqlqueries.js");
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

    const round1TableExists = await checkTableExists(con, "round1");
    if (round1TableExists) {
      console.log("Rounds tables already exists");
      return;
    }

    await createRound1Table(con, "round1");
    await createRound1Table(con, "round2");
    await createRound1Table(con, "round3");
    await createRound1Table(con, "round4");
    await createRound1Table(con, "round5");
    await createRound1Table(con, "round6");
    
    console.log("Rounds tables created successfully!!");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { initializeUsersTable };
