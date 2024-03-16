var XLSX = require("xlsx");
var mysql = require("mysql2");
const { selectQuery } = require("./sqlqueries");

async function updateDecision(
  con,
  applicant,
  round,
  coapIdColumnName,
  candidateDecisonColumnName,
  branch
) {
  currCOAP = applicant[coapIdColumnName];
  currDecision = applicant[candidateDecisonColumnName];
  console.log(currCOAP, currDecision);
  try {
    var [checkPreviousStatus] = await con.query(
      `SELECT OfferedRound, RetainRound, RejectOrAcceptRound FROM applicationstatus WHERE COAP = ? AND branch = ?;`,
      [currCOAP, branch]
    );
    bool_previousRetain = checkPreviousStatus[0].RetainRound != "";
    bool_previousRejectOrAccept =
      checkPreviousStatus[0].RejectOrAcceptRound != "";
    if (currDecision == "Reject and Wait") {
      if (!bool_previousRejectOrAccept) {
        try {
          var [updatedStatus] = await con.query(
            `UPDATE applicationstatus
                        SET Accepted = 'N', RejectOrAcceptRound = ?
                        WHERE COAP = ? AND branch = ?;`,
            [round, currCOAP, branch]
          );
        } catch (error) {
          throw error;
        }
      }
    } else if (currDecision == "Retain and Wait") {
      if (!bool_previousRetain) {
        try {
          var [updatedStatus] = await con.query(
            `UPDATE applicationstatus
                        SET Accepted = 'R', RetainRound = ?
                        WHERE COAP = ? AND branch = ?;`,
            [round, currCOAP, branch]
          );
        } catch (error) {
          throw error;
        }
      }
    } else if (currDecision == `Accept and Freeze`) {
      if (!bool_previousRejectOrAccept) {
        try {
          var [updatedStatus] = await con.query(
            `UPDATE applicationstatus
                        SET Accepted = 'Y', RejectOrAcceptRound = ?
                        WHERE COAP = ? AND branch = ?;`,
            [round, currCOAP, branch]
          );
        } catch (error) {
          throw error;
        }
      }
    }
  } catch (error) {
    throw error;
  }
  console.log(`Updated candidate Decision ${currCOAP}`);
}

async function updateStatusIITGList(
  databaseName,
  filePath,
  round,
  coapIdColumnName,
  candidateDecisonColumnName,
  branch
) {
  var con = mysql
    .createPool({
      host: process.env.MYSQL_HOSTNAME,
      user: "root",
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    })
    .promise();
  var workbook = XLSX.readFile(filePath);
  var applicantsDataSheet = workbook.Sheets[workbook.SheetNames[0]];
  var applicantsData = XLSX.utils.sheet_to_json(applicantsDataSheet);
  for (const applicant of applicantsData) {
    try {
      var [isCS] = await con.query(
        `SELECT COUNT(*) AS count FROM applicationstatus WHERE COAP = ? AND branch = ?;`,
        [applicant[coapIdColumnName], branch]
      );
      if (isCS[0].count == 1) {
        try {
          var x = await updateDecision(
            con,
            applicant,
            round,
            coapIdColumnName,
            candidateDecisonColumnName,
            branch
          );
        } catch (error) {
          throw error;
        }
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = { updateStatusIITGList };
