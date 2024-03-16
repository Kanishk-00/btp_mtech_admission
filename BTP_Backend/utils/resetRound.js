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

  // Deleting all the offered candidates in that round and retain and accepted round as that of current number
  try {
    const result = await con.query(`
    DELETE FROM applicationstatus 
    WHERE (Offered="Y" AND OfferedRound='${roundNumber}') 
      OR (RetainRound='${roundNumber}')
      OR (RejectOrAcceptRound='${roundNumber}')
      AND branch = '${branch}'
  `);
  } catch (error) {
    throw error;
  }
}

module.exports = { resetRound };
