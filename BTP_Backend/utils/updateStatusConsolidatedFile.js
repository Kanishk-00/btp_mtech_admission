const XLSX = require("xlsx");
const mysql = require("mysql2");
const { selectQuery } = require("./sqlqueries");

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
      `SELECT OfferedRound, RetainRound, RejectOrAcceptRound FROM applicationstatus WHERE COAP = ? AND branch = ?;`,
      [currCOAP, branch]
    );
    if (checkPreviousStatus.length === 0) {
      try {
        await con.query(
          `INSERT INTO applicationstatus (COAP, Offered, Accepted, RejectOrAcceptRound, branch) VALUES (?, '', 'E', ?, ?)`,
          [currCOAP, round, branch]
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
        `SELECT COUNT(*) AS count FROM applicationstatus WHERE COAP = ? AND branch = ?;`,
        [applicant[coapIdColumnName], branch]
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
