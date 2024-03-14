var XLSX = require("xlsx");
var mysql = require("mysql2");
const { selectQuery } = require("./sqlqueries");
// const { checkFileLegitimacy } = require('./checkLegitimacy');
/* 
    function Name:updateDecision
    input :connection object,applicant data,current round
    output: void
*/
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
    //check previos status
    var [checkPreviousStatus] =
      await con.query(`SELECT OfferedRound, RetainRound, RejectOrAcceptRound FROM ${branch}_applicationstatus WHERE 
        COAP = '${currCOAP}' ;`);
    bool_previousRetain = checkPreviousStatus[0].RetainRound != ""; //check if previously retained
    bool_previousRejectOrAccept =
      checkPreviousStatus[0].RejectOrAcceptRound != ""; //check if previously rejectedOrAccepted
    if (currDecision == "Reject and Wait") {
      if (!bool_previousRejectOrAccept) {
        //update the status to rejected('N')
        try {
          var [updatedStatus] =
            await con.query(`UPDATE ${branch}_applicationstatus
                        set Accepted = 'N', RejectOrAcceptRound = '${round}'
                        where COAP = '${currCOAP}'`);
          // console.log(updatedStatus);
        } catch (error) {
          throw error;
        }
      }
    } else if (currDecision == "Retain and Wait") {
      if (!bool_previousRetain) {
        try {
          //update the status to retain('R')
          var [updatedStatus] =
            await con.query(`UPDATE ${branch}_applicationstatus
                        set Accepted = 'R', retainRound ='${round}'
                        where COAP = '${currCOAP}'`);
        } catch (error) {
          throw error;
        }
      }
    } else if (currDecision == `Accept and Freeze`) {
      if (!bool_previousRejectOrAccept) {
        try {
          //update the status to accept('Y')
          var [updatedStatus] =
            await con.query(`UPDATE ${branch}_applicationstatus
                        set Accepted = 'Y', RejectOrAcceptRound = '${round}'
                        where COAP = '${currCOAP}'`);
        } catch (error) {
          throw error;
        }
      }
    }
  } catch (error) {
    throw error;
  }
  console.log(`updated candidate Desion ${currCOAP}`);
}
/* 
    function Name:updateStatusIITGList
    input :database name,file path to the IIT GOA offer status file,current round
    output: void
*/
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
  // console.log(applicantsData);
  for (const applicant of applicantsData) {
    try {
      // console.log("inside try");
      //checking if applicant is i the database or not
      var [isCS] =
        await con.query(`SELECT COUNT(*) AS count FROM ${branch}_applicationstatus WHERE 
            COAP = '${applicant[coapIdColumnName]}' ;`);
      if (isCS[0].count == 1) {
        try {
          //updating the decision
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
// updateStatus('Applicants2019',`C:\\Users\\noel vincent\\Desktop\\BTP_Backend\\IIT Goa Candidate Decision Report.xlsx`,0);
module.exports = { updateStatusIITGList };
