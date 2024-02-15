const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOSTNAME,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});
module.exports = connection;
