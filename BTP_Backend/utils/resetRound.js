const path = require("path");
const fs = require("fs");
const mysql = require("mysql2");

async function resetRound(inputRoundNumber, branch) {
  const roundNumber = inputRoundNumber;
  const userBranchPath = path.join(__dirname, "..", "files", branch);
  const roundUpdatesDirectory = path.join(userBranchPath, "roundUpdates");
  const generatedOffersDirectory = path.join(userBranchPath, "generatedOffers");

  // Deleting uploaded files
  const filePaths = [
    path.join(
      roundUpdatesDirectory,
      `round${roundNumber}_ConsolidatedFile.xlsx`
    ),
    path.join(
      roundUpdatesDirectory,
      `round${roundNumber}_IITGCandidateDecision.xlsx`
    ),
    path.join(
      roundUpdatesDirectory,
      `round${roundNumber}_IITGOfferedButNotInterested.xlsx`
    ),
    path.join(generatedOffersDirectory, `round${roundNumber}.xlsx`),
  ];

  for (const filePath of filePaths) {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) throw err;
        console.log(`${filePath} was deleted`);
      });
    }
  }

  // Connecting to database
  const con = mysql
    .createPool({
      host: process.env.MYSQL_HOSTNAME,
      user: "root",
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    })
    .promise();
  
  try {
    sqlQuery1 = `DELETE FROM applicationstatus WHERE branch = '${branch}'`;
    const res1 = await con.query(sqlQuery1);
    if (inputRoundNumber > 1) {
      sqlQuery2 = `INSERT INTO applicationstatus SELECT * FROM round${inputRoundNumber - 1}`;
      const res2 = await con.query(sqlQuery2);
    }
  } catch (error) {
    throw error;
  }
  /*
  // Deleting all the offered candidates in that round and retain and accepted round as that of current number
  try {
    const sqlQuery = `
    DELETE FROM applicationstatus 
    WHERE 
      (
        (Offered <> 'Y' AND OfferedRound <> '${roundNumber}')
        OR RetainRound <> '${roundNumber}'
        OR RejectOrAcceptRound <> '${roundNumber}'
      )
      AND branch = '${branch}'
  `;
    console.log("SQL query being executed:", sqlQuery); // Log the SQL query

    const result = await con.query(`
    DELETE FROM applicationstatus 
    WHERE 
      (
        (Offered <> 'Y' AND OfferedRound <> '${roundNumber}')
        OR RetainRound <> '${roundNumber}'
        OR RejectOrAcceptRound <> '${roundNumber}'
      )
      AND branch = '${branch}'
  `);
    console.log("the result of the branch is: ", branch);
    console.log("the result of the deletion query is: ", result[0]);
  } catch (error) {
    throw error;
  }*/
}

module.exports = { resetRound };
