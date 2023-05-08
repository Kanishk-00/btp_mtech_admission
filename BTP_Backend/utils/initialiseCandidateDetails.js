var XLSX = require("xlsx");
var sqlQueries=require("./sqlqueries");
var applicantsSchema=require("../schemas/applicantsSchema").applicantsSchema;
var applicantsSchemaColumnNames=require("../schemas/applicantsSchema").applicantsSchemaColumnNames;
var mysql = require('mysql2');
/*
    Name: enterCandidateDetailsToDatabase
    Input : modified columnnames file path,databasename
    output: void
    Functionality :inserts all the candidate details into the mtechappl table.
*/
async function enterCandidateDetailsToDatabase(filePath,databaseName) {
  //Creating a Connection
  var con =mysql.createPool({
    host: process.env.MYSQL_HOSTNAME,
    user: "root",
    password:process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  }).promise();
  var createTableRes=await sqlQueries.createTable(con,"mtechappl",applicantsSchema);
 
  /*
    Opening the workbook and converting each row into JSON object with column name as key
  */
  var workbook = XLSX.readFile(filePath);
  var applicantsDataSheet = workbook.Sheets[workbook.SheetNames[0]];
  var applicantsData=XLSX.utils.sheet_to_json(applicantsDataSheet);
  
  /*
    Creating the values array which will be used to query(insert in) the database
  */
  var valuesToBeInserted=[];
  for(var applicant of applicantsData){
    var applicantAttributes=[];
    for (var columnName of applicantsSchemaColumnNames){
      //calculating max gate score
        if(columnName=="MaxGateScore"){
          var currYearScore=-1;
          var prevYearScore=-1;
          var prevPrevYearScore=-1;
          if(applicant["GATE22Score"]!=null) currYearScore=applicant["GATE22Score"];
          if(applicant["GATE21Score"]!=null) prevYearScore=applicant["GATE21Score"];
          if(applicant["GATE23Score"]!=null) prevPrevYearScore=applicant["GATE23Score"];
          var maxScore=Math.max(currYearScore,Math.max(prevPrevYearScore,prevYearScore));
          applicantAttributes.push(maxScore);
        }
        //calculating virtual cgpa
        else if(columnName==='DegreeCGPA8thSem'){
          if(applicant['DegreeCGPA8thSem']==null){
            if(applicant['DegreePer8thSem']!=null){
              applicant['DegreeCGPA8thSem']=(applicant['DegreePer8thSem']/10);
            }
          }
          applicantAttributes.push(applicant[columnName]);
        }
        else{
          applicantAttributes.push(applicant[columnName]);
        }
    }
    valuesToBeInserted.push(applicantAttributes);
  }
  
  /*
    creating a string of comma seperated column names
  */
  var columnNames="(";
  for (var columnName of applicantsSchemaColumnNames){
    columnNames+=columnName+",";
  }
  columnNames=columnNames.slice(0,-1)
  columnNames+=")";
  
  /*
    inserting into database
  */
  var insertIntoTableRes=await sqlQueries.insertManyIntoTable(con,"mtechappl",columnNames,valuesToBeInserted);
  console.log("Initialised candidate table");

  return;
}
// enterCandidateDetailsToDatabase("./ApplicantData_withCOAPcorr_maxGateRoll.xlsx","Applicants2019")
module.exports={enterCandidateDetailsToDatabase}
