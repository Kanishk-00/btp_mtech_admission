var XLSX = require("xlsx");
var mysql = require('mysql2');
const { selectQuery } = require("./sqlqueries");
// const { checkFileLegitimacy } = require('./checkLegitimacy');
/* 
    function Name:updateDecision
    input :connection object,applicant data,current round
    output: void
*/
async function updateDecision(con,applicant,round,coapIdColumnName,candidateDecisonColumnName){
    currCOAP = applicant[coapIdColumnName];
    currDecision =  applicant[candidateDecisonColumnName];
    console.log(currCOAP,currDecision);
    try {
        var [checkPreviousStatus] = await con.query(`SELECT OfferedRound, RetainRound, RejectOrAcceptRound FROM applicationstatus WHERE 
        COAP = '${currCOAP}' ;`);
        // console.log(checkPreviousStatus[0]);
        bool_previousRetain = (checkPreviousStatus[0].RetainRound != '') //check if previously retained
        bool_previousRejectOrAccept = (checkPreviousStatus[0].RejectOrAcceptRound != '') //check if previously rejectedOrAccepted
        if (currDecision.includes(`ACCEPTED`)) {
                try {
                    //setting status to E (not eligible)
                    var [updatedStatus]=await con.query(`UPDATE applicationstatus
                        set Accepted = 'E', RejectOrAcceptRound = '${round}'
                        where COAP = '${currCOAP}'`)
                } catch (error) {
                    throw error
                }
        }
    } catch (error) {
        throw error;
    }
    console.log(`updated candidate Desion ${currCOAP}`);

}
/* 
    function Name:updateStatusIITGNotInterested
    input :database name,file path to the accepted and freeze at the other institute file,current round
    output: void
*/
async function updateStatusIITGNotInterested(databaseName,filePath,round,coapIdColumnName,candidateDecisonColumnName){
    var con =mysql.createPool({
        host: process.env.MYSQL_HOSTNAME,
        user: "root",
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    }).promise();
    var workbook = XLSX.readFile(filePath);
    var applicantsDataSheet = workbook.Sheets[workbook.SheetNames[0]];
    var applicantsData=XLSX.utils.sheet_to_json(applicantsDataSheet);
    // console.log(applicantsData);
    for (const applicant of applicantsData) {
        try {
            // console.log("inside try");
            //checking if the applicant is present in the database
            var [isCS]=await con.query(`SELECT COUNT(*) AS count FROM applicationstatus WHERE 
            COAP = '${applicant[coapIdColumnName]}' ;`)
            // console.log(isCS[0]);
            // console.log(applicant[`COAP Reg Id`]);
            if(isCS[0].count==1){
                try {
                    //updating status
                    var x= await updateDecision(con,applicant,round,coapIdColumnName,candidateDecisonColumnName);
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
module.exports={updateStatusIITGNotInterested};
