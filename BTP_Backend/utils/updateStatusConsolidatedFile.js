const XLSX = require("xlsx");
const mysql = require("mysql2");
const { selectQuery } = require("./sqlqueries");

/* 
    Function Name: updateDecision
    Input: connection object, applicant data, current round, COAP column name, candidate decision column name
    Output: void
*/
async function updateDecision(
  con,
  applicant,
  round,
  coapIdColumnName,
  candidateDecisonColumnName,
  branch
) {
  const currCOAP = applicant[coapIdColumnName];
  const currDecision = applicant[candidateDecisonColumnName];
  console.log(currCOAP, currDecision);
  try {
    const [checkPreviousStatus] = await con.query(
      `SELECT OfferedRound, RetainRound, RejectOrAcceptRound FROM ${branch}_applicationstatus WHERE COAP = ?;`,
      [currCOAP]
    );
    if (checkPreviousStatus.length === 0) {
      try {
        await con.query(
          `INSERT INTO ${branch}_applicationstatus (COAP, Offered, Accepted, RejectOrAcceptRound) VALUES (?, '', 'E', ?)`,
          [currCOAP, round]
        );
      } catch (error) {
        throw error;
      }
    }
  } catch (error) {
    throw error;
  }
  console.log(`Updated candidate decision ${currCOAP}`);
}

/* 
    Function Name: updateStatusConsolidatedFile
    Input: database name, file path to the consolidated file, current round, COAP column name, candidate decision column name, branch
    Output: void
*/
async function updateStatusConsolidatedFile(
  databaseName,
  filePath,
  round,
  coapIdColumnName,
  candidateDecisonColumnName,
  branch
) {
  const con = mysql
    .createPool({
      host: process.env.MYSQL_HOSTNAME,
      user: "root",
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    })
    .promise();
  const workbook = XLSX.readFile(filePath);
  const applicantsDataSheet = workbook.Sheets[workbook.SheetNames[0]];
  const applicantsData = XLSX.utils.sheet_to_json(applicantsDataSheet);
  for (const applicant of applicantsData) {
    try {
      const [isCS] = await con.query(
        `SELECT COUNT(*) AS count FROM ${branch}_applicationstatus WHERE COAP = ?;`,
        [applicant[coapIdColumnName]]
      );
      if (isCS[0].count === 1) {
        await updateDecision(
          con,
          applicant,
          round,
          coapIdColumnName,
          candidateDecisonColumnName,
          branch
        );
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = { updateStatusConsolidatedFile };
