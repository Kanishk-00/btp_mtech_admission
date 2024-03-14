const path = require("path");
const fs = require("fs");
var mysql = require("mysql2");
const userFilePath = path.join(__dirname, "..", "files");
async function resetRound(inputRoundNumber) {
  let roundNumber = inputRoundNumber;
  //deleting uploaded files
  var filePaths = [
    `${userFilePath}/roundUpdates/round${roundNumber}_ConsolidatedFile.xlsx`,
    `${userFilePath}/roundUpdates/round${roundNumber}_IITGCandidateDecision.xlsx`,
    `${userFilePath}/roundUpdates/round${roundNumber}_IITGOfferedButNotInterested.xlsx`,
    `${userFilePath}/generatedOffers/round${roundNumber}.xlsx`,
  ];
  for (const filePath of filePaths) {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) throw err;
        console.log(`${filePath} was deleted`);
      });
    }
  }
  //connecting to database
  var con = mysql
    .createPool({
      host: process.env.MYSQL_HOSTNAME,
      user: "root",
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    })
    .promise();
  //deleting all the offered candiadates in that round and retain and accepted round as that of current number
  try {
    const result =
      await con.query(`DELETE FROM applicationstatus WHERE (Offered="Y" and OfferedRound='${roundNumber}') 
        or (RetainRound='${roundNumber}')
        or (RejectOrAcceptRound='${roundNumber}')`);
  } catch (error) {
    throw error;
  }
}

module.exports = { resetRound };
