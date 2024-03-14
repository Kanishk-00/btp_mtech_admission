const path = require("path");
const fs = require("fs");
const mysql = require("mysql2");

const userFilePath = path.join(__dirname, "..", "files");

async function resetDatabase(branch) {
  const branchFolder = path.join(userFilePath, branch);
  const modifiedFilePath = path.join(branchFolder, "modifiedFile.xlsx");
  const uploadedFilePath = path.join(branchFolder, "uploadedFile.xlsx");

  // Deleting files
  if (fs.existsSync(modifiedFilePath)) {
    fs.unlinkSync(modifiedFilePath);
    console.log(`${modifiedFilePath} was deleted`);
  }
  if (fs.existsSync(uploadedFilePath)) {
    fs.unlinkSync(uploadedFilePath);
    console.log(`${uploadedFilePath} was deleted`);
  }

  // Creating connection
  const con = mysql
    .createPool({
      host: process.env.MYSQL_HOSTNAME,
      user: "root",
      password: process.env.MYSQL_PASSWORD,
      database: `${process.env.MYSQL_DATABASE}`,
    })
    .promise();

  // Dropping tables
  try {
    const resultApplicationStatus = await con.query(
      `DROP TABLE IF EXISTS  ${branch}_applicationstatus;`
    );
    const result = await con.query(`DROP TABLE IF EXISTS ${branch}_mtechappl;`);
    const resultSeatMatrix = await con.query(
      `DROP TABLE IF EXISTS  ${branch}_seatMatrix;`
    );
  } catch (error) {
    throw error;
  }
}

module.exports = { resetDatabase };
