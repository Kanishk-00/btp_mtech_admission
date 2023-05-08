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
    //applicant coapid
    currCOAP = applicant[coapIdColumnName];
    //applicant decision
    currDecision =  applicant[candidateDecisonColumnName];
    console.log(currCOAP,currDecision);
    try {
        //check if previously offered
        var [checkPreviousStatus] = await con.query(`SELECT OfferedRound, RetainRound, RejectOrAcceptRound FROM applicationstatus WHERE 
        COAP = '${currCOAP}' ;`);
        // console.log(checkPreviousStatus);
        //if not offered make the offered status to E
        //if offered those will be updated in the previous/other files
        if(checkPreviousStatus.length==0){
            try {
                var [insertquery]=await con.query(`insert into applicationstatus
                    (COAP,
                     Offered,
                     Accepted,
                     RejectOrAcceptRound
                     )
                    values ('${currCOAP}','','E','${round}')`);
            } catch (error) {
                throw error;
            }
            
        }
    } catch (error) {
        throw error;
    }
    console.log(`updated candidate Desion ${currCOAP}`);

}
/* 
    function Name:updateStatusConsolidatedFile
    input :databasename,file path to the consolidated file,current round
*/
async function updateStatusConsolidatedFile(databaseName,filePath,round,coapIdColumnName,candidateDecisonColumnName){
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
            //checking if he is present in our database
            var [isCS]=await con.query(`SELECT COUNT(*) AS count FROM mtechappl WHERE 
            COAP = '${applicant[coapIdColumnName]}' ;`);
            if(isCS[0].count===1){
                // console.log(applicant);
                try {
                    //updating his decison
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
module.exports={updateStatusConsolidatedFile};
