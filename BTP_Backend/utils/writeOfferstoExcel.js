const reader = require('xlsx');
var mysql = require('mysql2');

var applicantsSchemaColumnNames=require("../schemas/applicantsSchema").applicantsSchemaColumnNames;
/* 
    function Name:writeToExcel
    input :connection object,shortlisted candidates,sheet name,category, current round,filename to which it should be writtten
    output: void
*/
async function writeToExcel(con,data,sheetName,category,round,fileName){
        //column names
    var columnNames="applicationstatus.offered,applicationstatus.Accepted,";
    for (var columnName of applicantsSchemaColumnNames){
            columnNames+=`mtechappl.${columnName}`+",";
    }
    columnNames=columnNames.slice(0,-1);
    // columnNames+=")";
    //querying string and writing the offers of that category to file
    try {
        var [result]=await con.query(`select ${columnNames} FROM mtechappl 
        left join applicationstatus
        on mtechappl.COAP = applicationstatus.COAP 
        where mtechappl.Category='${category}'  order by mtechappl.MaxGateScore DESC`);
        const file = reader.readFile(fileName)
        const ws = reader.utils.json_to_sheet(result);
        reader.utils.book_append_sheet(file,ws,sheetName)
        // Writing to our file
        reader.writeFile(file,fileName)
    } catch (error) {
        throw error;
    }


}
/* 
    function Name:writeToExcelFemale
    input :connection object,shortlisted candidates,sheet name,category, current round,filename to which it should be writtten
    output: void
*/
async function writeToExcelFemaleCandidates(con,data,sheetName,category,round,fileName){
        //column names
    var columnNames="applicationstatus.offered,applicationstatus.Accepted,";
    for (var columnName of applicantsSchemaColumnNames){
            columnNames+=`mtechappl.${columnName}`+",";
    }
    columnNames=columnNames.slice(0,-1);
    // columnNames+=")";
    //querying string and writing the offers of that category to file
    try {
        var [result]=await con.query(`select ${columnNames} FROM mtechappl 
        left join applicationstatus
        on mtechappl.COAP = applicationstatus.COAP 
        where mtechappl.Category='${category}' and Gender = "Female" order by mtechappl.MaxGateScore DESC`);
        const file = reader.readFile(fileName)
        const ws = reader.utils.json_to_sheet(result);
        reader.utils.book_append_sheet(file,ws,sheetName)
        // Writing to our file
        reader.writeFile(file,fileName)

    } catch (error) {
        throw error
    }

}
/* 
    function Name:writeToExcelEWS
    input :connection object,shortlisted candidates,sheet name,category, current round,filename to which it should be writtten
    output: void
*/
async function writeToExcelEWS(con,data,sheetName,category,round,fileName){
        //column names

        var columnNames="applicationstatus.offered,applicationstatus.Accepted,";
        for (var columnName of applicantsSchemaColumnNames){
                columnNames+=`mtechappl.${columnName}`+",";
        }
        columnNames=columnNames.slice(0,-1);
        // columnNames+=")";
        //querying string and writing the offers of that category to file
        try {
                var [result]=await con.query(`select ${columnNames} FROM mtechappl 
                left join applicationstatus
                on mtechappl.COAP = applicationstatus.COAP 
                where EWS='Yes'  order by mtechappl.MaxGateScore DESC`);
                const file = reader.readFile(fileName)
                const ws = reader.utils.json_to_sheet(result);
                reader.utils.book_append_sheet(file,ws,sheetName)
                // Writing to our file
                reader.writeFile(file,fileName)
                
        } catch (error) {
                throw error;
        }
}

/* 
    function Name:writeToExcelAllOffers
    input :connection object,sheet name,current round,filename to which it should be writtten
    output: void
*/
async function writeToExcelAllOffers(con,sheetName,round,fileName){
        //column names
        var columnNames="applicationstatus.offerCat,mtechappl.PWD as 'IsPWD',applicationstatus.offered,applicationstatus.Accepted,";
        for (var columnName of applicantsSchemaColumnNames){
                columnNames+=`mtechappl.${columnName}`+",";
        }
        columnNames=columnNames.slice(0,-1);
        // columnNames+=")";
        //querying string and writing to the file
        try {
                var [result]=await con.query(`select ${columnNames} FROM mtechappl
                left join applicationstatus
                on mtechappl.COAP = applicationstatus.COAP 
                where (OfferedRound='${round}' or Accepted='R' or Accepted='Y') order by applicationstatus.offerCat ASC,mtechappl.MaxGateScore DESC`);
                // console.log(result)
                const file = reader.readFile(fileName)
                const ws = reader.utils.json_to_sheet(result);
                reader.utils.book_append_sheet(file,ws,sheetName)
                // Writing to our file
                reader.writeFile(file,fileName);
                deleteWorksheet(fileName,"Sheet1");
             
        } catch (error) {
                throw error;
        }

}
/* 
    function Name:writeToExcelGeneral
    input :connection object,shortlisted candidates,sheet name,category, current round,filename to which it should be writtten
    output: void
*/
async function writeToExcelGeneral(con,data,sheetName,category,round,fileName){
        //column names
    var columnNames="applicationstatus.offered,applicationstatus.Accepted,";
    for (var columnName of applicantsSchemaColumnNames){
            columnNames+=`mtechappl.${columnName}`+",";
    }
    columnNames=columnNames.slice(0,-1);
    // columnNames+=")";
    //querying string and writing the offers of that category to file
    try {
        var [result]=await con.query(`select ${columnNames} FROM mtechappl 
        left join applicationstatus
        on mtechappl.COAP = applicationstatus.COAP 
        order by mtechappl.MaxGateScore DESC`);
        const file = reader.readFile(fileName)
        const ws = reader.utils.json_to_sheet(result);
        reader.utils.book_append_sheet(file,ws,sheetName)
        // Writing to our file
        reader.writeFile(file,fileName);
    } catch (error) {
        throw error;        
    }

}
/* 
    function Name:writeToExcelGeneralFemale
    input :connection object,shortlisted candidates,sheet name,category, current round,filename to which it should be writtten
    output: void
*/
async function writeToExcelGeneralFemale(con,data,sheetName,category,round,fileName){
        //column names
    var columnNames="applicationstatus.offered,applicationstatus.Accepted,";
    for (var columnName of applicantsSchemaColumnNames){
            columnNames+=`mtechappl.${columnName}`+",";
    }
    columnNames=columnNames.slice(0,-1);
    // columnNames+=")";
    //querying string and writing the offers of that category to file
    try {
        var [result]=await con.query(`select ${columnNames} FROM mtechappl 
        left join applicationstatus
        on mtechappl.COAP = applicationstatus.COAP 
        where Gender="Female" order by mtechappl.MaxGateScore DESC`);
        const file = reader.readFile(fileName)
        const ws = reader.utils.json_to_sheet(result);
        reader.utils.book_append_sheet(file,ws,sheetName)
        // Writing to our file
        reader.writeFile(file,fileName)
    } catch (error) {
        throw error;        
    }

        
}
/* 
    function Name:writeToExcelPWD
    input :connection object,shortlisted candidates,sheet name,category, current round,filename to which it should be writtten
    output: void
*/
async function writeToExcelPWD(con,data,sheetName,category,round,fileName){
        //column names
    var columnNames="applicationstatus.offered,applicationstatus.Accepted,";
    for (var columnName of applicantsSchemaColumnNames){
            columnNames+=`mtechappl.${columnName}`+",";
    }
    columnNames=columnNames.slice(0,-1);
    // columnNames+=")";
    //querying string and writing the offers of that category to file
    try {
        var [result]=await con.query(`select ${columnNames} FROM mtechappl 
        left join applicationstatus
        on mtechappl.COAP = applicationstatus.COAP where  
        Pwd='Yes' and category REGEXP '${category}' order by mtechappl.MaxGateScore DESC`);
            const file = reader.readFile(fileName)
            const ws = reader.utils.json_to_sheet(result);
            reader.utils.book_append_sheet(file,ws,sheetName)
            // Writing to our file
            reader.writeFile(file,fileName)
    } catch (error) {
        throw error;
    }

}
/* 
    function Name:writeToExcelEWSPWD
    input :connection object,shortlisted candidates,sheet name,category, current round,filename to which it should be writtten
    output: void
*/
async function writeToExcelEWSPWD(con,data,sheetName,category,round,fileName){
        //column names
    var columnNames="applicationstatus.offered,applicationstatus.Accepted,";
    for (var columnName of applicantsSchemaColumnNames){
            columnNames+=`mtechappl.${columnName}`+",";
    }
    columnNames=columnNames.slice(0,-1);
    // columnNames+=")";
    //querying string and writing the offers of that category to file
    try {
        var [result]=await con.query(`select ${columnNames} FROM mtechappl 
        left join applicationstatus
        on mtechappl.COAP = applicationstatus.COAP where  
        Pwd='Yes' and EWS='Yes' and category REGEXP '${category}' order by mtechappl.MaxGateScore DESC`);
            const file = reader.readFile(fileName)
            const ws = reader.utils.json_to_sheet(result);
            reader.utils.book_append_sheet(file,ws,sheetName)
            // Writing to our file
            reader.writeFile(file,fileName);
    } catch (error) {
        throw error;
    }

}
const  deleteWorksheet = async (filePath, workSheetName) => {
        const workBook = reader.readFile(filePath);
        const workSheetNames = Object.keys(workBook.Sheets);
        console.log(workSheetNames)
        if (workSheetNames.includes(workSheetName)) {
            delete workBook.Sheets[workSheetName];
            delete workBook.SheetNames[workSheetName];
            indexToDelete = workBook.SheetNames.indexOf(workSheetName);
            workBook.SheetNames.splice(indexToDelete, 1);
            reader.writeFile(workBook, filePath);
        }
    }
module.exports={writeToExcel,writeToExcelAllOffers,writeToExcelEWS,writeToExcelGeneral,writeToExcelGeneralFemale,writeToExcelFemaleCandidates,writeToExcelPWD,deleteWorksheet,writeToExcelEWSPWD}
