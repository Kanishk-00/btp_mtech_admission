const { checkFileLegitimacy } = require('../utils/checkfileLegitimacy.js');
const router = require("express").Router();
const {initializeAppicantsStatus}=require("../utils/initialiseApplicationStatus.js");
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');
const {enterCandidateDetailsToDatabase}=require("../utils/initialiseCandidateDetails");
var XLSX = require("xlsx");
const { applicantSchema } = require('../schemas/applicantsSchema');
var mysql = require('mysql2');
const {selectQuery}=require("../utils/sqlqueries");
const {mapColumnNames}=require("../utils/changeColumnNames");
const {initialiseSeatMatrix} = require("../utils/initialiseSeatMatrix");
const userFilePath=path.join(__dirname,'..','files');
const {resetDatabase}=require("../utils/resetDatabase")
var fs1 = require('fs-extra');

/*
    Route:/api/initialise/getFile
    incoming data:uploaded coap file
    respone: 200 if the file is saved
*/ 
router.post("/getFile", (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: 'File parsing failed' });
        }
        var oldpath = files.file.filepath;
        var newpath = `${userFilePath}/uploadedFile.xlsx`;
        console.log("oldPath",oldpath);
        // console.log("new function start");
        fs1.move(oldpath, newpath, async function (err) {
            if (err){console.log(err);
                return res.status(500).send({ "result": 'File rename failed' });
            }
            res.status(200).send({"result": 'File renamed'});

        });
  
    });
});
/*
    Route:/api/initialise/saveToDataBase
    incoming data:matched column names database
    respone: 200 if the mtechappl table  is created
    Functionality: initiaises mtechappl table,seatmatrix table
*/ 
router.post("/saveToDataBase", async (req, res) => {
    var filePath = `${userFilePath}/uploadedFile.xlsx`;
    var matchedColumns=req.body.result;
    // console.log(req.body)
    //reading the uploaded file
   
   try {
    var workbook = XLSX.readFile(filePath);
    var applicantsDataSheet = workbook.Sheets[workbook.SheetNames[0]];
    var applicantsData=XLSX.utils.sheet_to_json(applicantsDataSheet,{defval:""});
    var data=[]
    //modyfing the column names
    for (const applicant of applicantsData) {
        row={};
        for (const uploadedColumn of Object.keys(matchedColumns)) {
            selectedColumn=matchedColumns[uploadedColumn];
            if(selectedColumn!='ignore' && applicant[uploadedColumn]!=""){
                row[selectedColumn]=applicant[uploadedColumn];
            }
        }
        data.push(row);
    }
    } catch (error) {
        console.error(error);
        res.status(500).send({ result: 'Error in reading the uploaded file' });
        return;
    }
    //creating the new excel file with modified column names
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Responses');
    XLSX.writeFile(wb, `${userFilePath}/modifiedFile.xlsx`);
    //initialising the seatmatrix table
    try {
        let res2= await enterCandidateDetailsToDatabase(`${userFilePath}/modifiedFile.xlsx`,process.env.MYSQL_DATABASE);
        let res1=await initialiseSeatMatrix(process.env.MYSQL_DATABASE,[
            ["ST_FandM",0],
            ["ST_Female",0],
            ["ST_Female_PWD",0],
            ["ST_FandM_PWD",0],
            ["SC_FandM",0]   ,
            ["SC_Female",0]  ,
            ["SC_Female_PWD",0]  ,
            ["SC_FandM_PWD",0],
            ["OBC_FandM",0]  ,
            ["OBC_Female",0] ,
            ["OBC_Female_PWD",0] ,
            ["OBC_FandM_PWD",0],
            ["EWS_FandM",0]   ,
            ["EWS_Female",0]   ,
            ["EWS_Female_PWD",0]   ,
            ["EWS_FandM_PWD",0],
            ["GEN_FandM",0]  ,
            ["GEN_Female",0]  ,
            ["GEN_Female_PWD",0]  ,
            ["GEN_FandM_PWD",0],
            ["COMMON_PWD",0]
        ])
        let response=await initializeAppicantsStatus(process.env.MYSQL_DATABASE);
        res.status(200).send({"result":"success"});
    } catch (error) {
        console.log(error);
        try {
            let didReset=await resetDatabase();
        } catch (error) {
            console.log(error);
        }
        res.status(500).send({"result":`${error.sqlMessage}`});

    }

});
/*
    Route:/api/initialise/getMatchedColumnNames
    incoming data: --
    respone: json object containing old column name and key as matching column name.to know more see mapColumnNames function.
*/ 
router.get("/getMatchedColumnNames", (req, res) => {
    try {
        var result=mapColumnNames(`${userFilePath}/uploadedFile.xlsx`);
        // throw err;
        res.status(200).send({"result":result});
    } catch (error) {
        console.log(error);
        res.status(500).send({error: error.message});
    }
});
/*
    Route:/api/initialise/getMasterFileUploadStatus
    incoming data: --
    respone: json object as true if master file uploaded.
*/ 
router.get("/getMasterFileUploadStatus", (req, res) => {
   try {
        //checking if a file exists
        if(fs.existsSync(`${userFilePath}/uploadedFile.xlsx`)) res.status(200).send({"result":true});
        else res.status(200).send({"result":false});
    } catch (error) {
        console.log(error);
        res.status(500).send({"result": error.message});
    } 
});
/*
    Route:/api/initialise/getMasterFileModifiedStatus
    incoming data: --
    respone: json object as true if master file modified.
*/ 
router.get("/getMasterFileModifiedStatus", (req, res) => {
   
   try {
     //checking if a file exists
    if(fs.existsSync(`${userFilePath}/modifiedFile.xlsx`)) res.status(200).send({"result":true});
    else res.status(200).send({"result":false});
} catch (error) {
    console.log(error);
    res.status(500).send({error: error.message});
}
});
/*
    Route:/api/initialise/reset
    incoming data: --
    functionality:deletes mtechappl,seat matrix table,deletes modified and uploaded files.
*/ 
router.get("/reset", async (req, res) => {
    //droping databases
    try {
        const res=await resetDatabase();
    } catch (error) {
        console.log(error);
        res.status(500).send({"result": false, "error": error.message});
    }
});
/*
    Route:/api/initialise/uploadedFile
    incoming data: --
    outgoing data: sends the saved uploaded file
*/ 
router.get("/uploadedFile", async (req, res) => {
    var options = {
        root: path.join(__dirname)
    };
    //sending stored file
    var fileName =`${userFilePath}/uploadedFile.xlsx`;
    res.sendFile(fileName, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});
/*
    Route:/api/initialise/modifiedFile
    incoming data: --
    outgoing data: sends the saved modifiedFile.
*/ 
router.get("/modifiedFile", async (req, res) => {
   try {
    var options = {
        root: path.join(__dirname)
    };
    //sending stored file
    var fileName =`${userFilePath}/modifiedFile.xlsx`;
    res.sendFile(fileName, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
    } catch (error) {
        console.error(error);
        res.status(500).send({ "result": 'Failed to send modified file' });
    }
});



module.exports = router;