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
    const bool_previousRetain = checkPreviousStatus[0].RetainRound !== ""; // Check if previously retained
    const bool_previousRejectOrAccept =
      checkPreviousStatus[0].RejectOrAcceptRound !== ""; // Check if previously rejectedOrAccepted
    if (currDecision && currDecision.includes(`ACCEPTED`)) {
      if (!bool_previousRejectOrAccept) {
        try {
          // Set status to E (not eligible)
          await con.query(
            `UPDATE ${branch}_applicationstatus SET Accepted = 'E', RejectOrAcceptRound = ? WHERE COAP = ?`,
            [round, currCOAP]
          );
        } catch (error) {
          throw error;
        }
      }
    }
  } catch (error) {
    throw error;
  }
  console.log(`Updated candidate decision ${currCOAP}`);
}

/* 
    Function Name: updateStatusIITGNotInterested
    Input: database name, file path to the accepted and freeze at the other institute file, current round, COAP column name, candidate decision column name, branch
    Output: void
*/
async function updateStatusIITGNotInterested(
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
      if (isCS[0].count == 1) {
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

module.exports = { updateStatusIITGNotInterested };
