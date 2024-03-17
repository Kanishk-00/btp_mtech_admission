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

  // Also Delete Round Details if available.

  const generatedOffersPath = path.join(branchFolder, "generatedOffers");
  const roundUpdatedPath = path.join(branchFolder, "roundUpdates");

  if (fs.existsSync(generatedOffersPath)) {
    fs.readdirSync(generatedOffersPath).forEach(file => {
      const filePath = path.join(generatedOffersPath, file);
      fs.unlinkSync(filePath);
      console.log(`${filePath} was deleted`);
    });
  }

  if (fs.existsSync(roundUpdatedPath)) {
    fs.readdirSync(roundUpdatedPath).forEach(file => {
      const filePath = path.join(roundUpdatedPath, file);
      fs.unlinkSync(filePath);
      console.log(`${filePath} was deleted`);
    });
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
    await con.query(`DELETE FROM applicationstatus WHERE branch = ?;`, [
      branch,
    ]);
    console.log(
      `Entries deleted from applicationstatus where branch is ${branch} successfully.`
    );

    // Delete entries from seatMatrix table where branch matches
    await con.query(`DELETE FROM seatMatrix WHERE branch = ?;`, [branch]);
    console.log(
      `Entries deleted from seatMatrix where branch is ${branch} successfully.`
    );


    // Delete entries from mtechappl table where branch matches
    await con.query(`DELETE FROM mtechappl WHERE branch = ?;`, [branch]);
    console.log(
      `Entries deleted from mtechappl where branch is ${branch} successfully.`
    );

  } catch (error) {
    throw error;
  }
}

module.exports = { resetDatabase };
