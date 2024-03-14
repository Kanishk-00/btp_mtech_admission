var XLSX = require("xlsx");
var sqlQueries=require("./sqlqueries");
var applicantsSchema=require("../schemas/applicantsSchema").applicantsSchema;
var applicantsSchemaColumnNames=require("../schemas/applicantsSchema").applicantsSchemaColumnNames;
var mysql = require('mysql2');

const tempDate = new Date();
let tempYear = tempDate.getFullYear();
const currYear = tempYear - 2000;
const prevYear = currYear - 1;
const prevprevYear = currYear - 2;

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
          if(applicant["GATE" + currYear + "Score"]!=null) currYearScore=applicant["GATE" + currYear + "Score"];
          if(applicant["GATE" + prevYear + "Score"]!=null) prevYearScore=applicant["GATE" + prevYear + "Score"];
          if(applicant["GATE" + prevprevYear + "Score"]!=null) prevPrevYearScore=applicant["GATE" + prevprevYear + "Score"];
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


        else if(columnName === 'currYearScore') {
          applicantAttributes.push(applicant["GATE" + currYear + "Score"])
        }
        else if(columnName === 'currYearRollNo') {
          applicantAttributes.push(applicant["GATE" + currYear + "RollNo"])
        }
        else if(columnName === 'currYearRank') {
          applicantAttributes.push(applicant["GATE" + currYear + "Rank"])
        }
        else if(columnName === 'currYearDisc') {
          applicantAttributes.push(applicant["GATE" + currYear + "Disc"])
        }
        
        else if(columnName === 'prevYearScore') {
          applicantAttributes.push(applicant["GATE" + prevYear + "Score"])
        }
        else if(columnName === 'prevYearRollNo') {
          applicantAttributes.push(applicant["GATE" + prevYear + "RollNo"])
        }
        else if(columnName === 'prevYearRank') {
          applicantAttributes.push(applicant["GATE" + prevYear + "Rank"])
        }
        else if(columnName === 'prevYearDisc') {
          applicantAttributes.push(applicant["GATE" + prevYear + "Disc"])
        }
        
        else if(columnName === 'prevprevYearScore') {
          applicantAttributes.push(applicant["GATE" + prevprevYear + "Score"])
        }
        else if(columnName === 'prevprevYearRollNo') {
          applicantAttributes.push(applicant["GATE" + prevprevYear + "RollNo"])
        }
        else if(columnName === 'prevprevYearRank') {
          applicantAttributes.push(applicant["GATE" + prevprevYear + "Rank"])
        }
        else if(columnName === 'prevprevYearDisc') {
          applicantAttributes.push(applicant["GATE" + prevprevYear + "Disc"])
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


// wkjebfubewofbw