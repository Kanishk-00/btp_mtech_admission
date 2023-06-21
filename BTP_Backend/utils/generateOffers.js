const mysql = require('mysql2');
// var query=require("./sqlqueries.js").selectQuery;
const {shortListGeneralCandidates,shortListGeneralFemaleCandidates}=require("./shortlistFunctions/shortListGeneralCandidates");
const {shortListEWSCandidates,shortListEWSFemaleCandidates}=require("./shortlistFunctions/shortListEWSCandidates");
const {shortListReservedCandidates}=require("./shortlistFunctions/shortListReservedCandidates");
const {shortListPWDCandidates,shortListEWSPWDCandidates}=require("./shortlistFunctions/shortListPWDCandidates");
const {shortlistCommonPWDCandidates}=require("./shortlistFunctions/shortlistCommonPWD.js");
const {writeToExcel,writeToExcelAllOffers,writeToExcelEWS,writeToExcelGeneral,writeToExcelGeneralFemale,writeToExcelFemaleCandidates,writeToExcelPWD,writeToExcelEWSPWD}=require("./writeOfferstoExcel");
const path = require('path');
const reader = require('xlsx');
const fs = require('fs');
const {findAvailableSeats,findAvailableSeatsPWD,findAvailableSeatsCommonPWD,findAvailableSeatsGeneral}=require("./findAvailableSeats");
const {updateFemaleCandidatesOfferedCategory}=require('./shortlistFunctions/femaleUpgradation');
/*
    Name: generateOffers
    Input : databaseName,current round,filepath to which these results are to be written.
    output: Number of seats yet to be booked in a particular category.
    Functionality :finds the number of seats yet to be booked in a particular category. 
*/
async function generateOffers(databaseName,round,filePath){
    //creating the connection to database
    var con =mysql.createPool({
        host: process.env.MYSQL_HOSTNAME,
        user: "root",
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    }).promise();
    try {
        //Reallocating or upgrading gender-neutral to female category (if Possible).
        var generalFemaleUpdates=updateFemaleCandidatesOfferedCategory(con,'GEN',round,await findAvailableSeats(con,"GEN_Female",round));
        var EWSFemaleUpdates=updateFemaleCandidatesOfferedCategory(con,'EWS',round,await findAvailableSeats(con,"EWS_Female",round));
        var OBCFemaleUpdates=updateFemaleCandidatesOfferedCategory(con,'OBC',round,await findAvailableSeats(con,"OBC_Female",round));
        var SCFemaleUpdates=updateFemaleCandidatesOfferedCategory(con,'SC',round,await findAvailableSeats(con,"SC_Female",round));
        var STFemaleUpdates=updateFemaleCandidatesOfferedCategory(con,'ST',round,await findAvailableSeats(con,"ST_Female",round));


        //shortlisting PWD candidates
        var commonPWDCandidates=await shortlistCommonPWDCandidates(con,await findAvailableSeatsCommonPWD(con,round),round);
        var generalPWDCandidates=await shortListPWDCandidates(con,await findAvailableSeatsPWD(con,"GEN_FandM_PWD",round),round,'\w*','GEN_FandM_PWD');
        var OBCPWDCandidates=await shortListPWDCandidates(con,await findAvailableSeatsPWD(con,"OBC_FandM_PWD",round),round,'OBC','OBC_FandM_PWD');
        var SCPWDCandidates=await shortListPWDCandidates(con,await findAvailableSeatsPWD(con,"SC_FandM_PWD",round),round,'SC','SC_FandM_PWD');
        var STPWDCandidates=await shortListPWDCandidates(con,await findAvailableSeatsPWD(con,"ST_FandM_PWD",round),round,'ST','ST_FandM_PWD');
        var EWSPWDCandidates=await shortListEWSPWDCandidates(con,await findAvailableSeatsPWD(con,"EWS_FandM_PWD",round),round,'Gen','EWS_FandM_PWD');
        //shortlisting General Female Candidates
        var generalFemaleCandidates=await shortListGeneralFemaleCandidates(con, await findAvailableSeatsGeneral(con,"GEN_Female",round),round);   
        //shortlisting General Candidates
        var generalCandidates=await shortListGeneralCandidates(con,await findAvailableSeatsGeneral(con,"GEN_FandM",round),round);    

        // console.log("candidates",generalCandidates);
        // console.log("Femalecandidates",generalFemaleCandidates);

        //shortlisting ews candidates
        var EWSCandidatesFemales=await shortListEWSFemaleCandidates(con,await findAvailableSeats(con,"EWS_Female",round),round);
        var EWSCandidates=await shortListEWSCandidates(con,await findAvailableSeats(con,"EWS_FandM",round),round);
        // writeToExcel(con,EWSCandidates,"EWS","EWS_FandM",round,filePath);
        // console.log("candidates---------------\n",EWSCandidates);
        // console.log("Femalecandidates------------------\n",EWSCandidatesFemales);

        //shortlisting obc candidates
        var OBCCandidatesFemales=await shortListReservedCandidates(con,await findAvailableSeats(con,"OBC_Female",round),"F","OBC",round);
        var OBCCandidates=await shortListReservedCandidates(con,await findAvailableSeats(con,"OBC_FandM",round),"M","OBC",round);
        // console.log("candidates---------------\n",OBCCandidates);
        // console.log("Femalecandidates------------------\n",OBCCandidatesFemales); 

        //shortlisting SC candidates
        var SCCandidatesFemales=await shortListReservedCandidates(con,await findAvailableSeats(con,"SC_Female",round),"F","SC",round);
        var SCCandidates=await shortListReservedCandidates(con,await findAvailableSeats(con,"SC_FandM",round),"M","SC",round);

        //shortlisting ST candidates  
        var STCandidatesFemales=await shortListReservedCandidates(con,await findAvailableSeats(con,"ST_Female",round),"F","ST",round);
        var STCandidates=await shortListReservedCandidates(con,await findAvailableSeats(con,"ST_FandM",round),"M","ST",round);
    } catch (error) {
        throw error;
    }
    
    try {
        //write all offers of this round to excel
        await writeToExcelAllOffers(con,'Offers-List',round,filePath);
        await writeToExcelPWD(con,generalPWDCandidates,"PWD-GEN","\w*",round,filePath);
        await writeToExcelPWD(con,OBCPWDCandidates,"PWD-OBC","OBC",round,filePath);
        await writeToExcelPWD(con,SCPWDCandidates,"PWD-SC","SC",round,filePath);
        await writeToExcelPWD(con,STPWDCandidates,"PWD-ST","ST",round,filePath);
        await writeToExcelEWSPWD(con,EWSPWDCandidates,"PWD-EWS","GEN",round,filePath);
        await writeToExcelGeneral(con,generalCandidates,"General-ALL","GEN",round,filePath);
        await writeToExcelGeneralFemale(con,generalFemaleCandidates,"General-Female","GEN",round,filePath)
        await writeToExcelEWS(con,EWSCandidates,"EWS","EWS",round,filePath);
        await writeToExcel(con,OBCCandidates,"OBC","OBC",round,filePath);
        await writeToExcelFemaleCandidates(con,OBCCandidatesFemales,"OBC-Female","OBC",round,filePath);
        await writeToExcel(con,SCCandidates,"SC","SC",round,filePath);
        await writeToExcelFemaleCandidates(con,SCCandidatesFemales,"SC-Female","SC",round,filePath);
        await writeToExcel(con,STCandidates,"ST","ST",round,filePath);
        await writeToExcelFemaleCandidates(con,STCandidatesFemales,"ST-Female","ST",round,filePath);
    } catch (error) {
        throw error;
    }
}

module.exports={generateOffers};