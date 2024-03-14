const { checkFileLegitimacy } = require("../utils/checkfileLegitimacy.js");
const router = require("express").Router();
const {
  initializeAppicantsStatus,
} = require("../utils/initialiseApplicationStatus.js");
const path = require("path");
const formidable = require("formidable");
const fs = require("fs");
const {
  enterCandidateDetailsToDatabase,
} = require("../utils/initialiseCandidateDetails");
var XLSX = require("xlsx");
const { applicantSchema } = require("../schemas/applicantsSchema");
var mysql = require("mysql2");
const { selectQuery } = require("../utils/sqlqueries");
const { mapColumnNames } = require("../utils/changeColumnNames");
const { initialiseSeatMatrix } = require("../utils/initialiseSeatMatrix");
const userFilePath = path.join(__dirname, "..", "files");
const { resetDatabase } = require("../utils/resetDatabase");
var fs1 = require("fs-extra");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middleware/authMiddleware.js");
const express = require("express");
const cors = require("cors");
const app = express();
// Enable CORS for all routes
app.use(cors());

// router.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

/*
    Route:/api/initialise/getFile
    incoming data:uploaded coap file
    respone: 200 if the file is saved
*/

router.post("/getFile", isAuthenticated, (req, res) => {
  // Middleware will have already verified the JWT token and attached user data to req.user if it's valid
  // Now you can access user data from req.user and perform authorization checks if required
  if (!req.user) {
    // User is not authenticated, trigger alert message
    return res
      .status(401)
      .send({ error: "Please log in with correct credentials" });
  }

  const branchFilePath = path.join(__dirname, "../", "branchStore.txt");

  fs.readFile(branchFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    else {
      console.log("File read branch = ", data);
    }
  });

  
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: "File parsing failed" });
    }

    var oldpath = files.file.filepath;
    var newpath = `${userFilePath}/uploadedFile.xlsx`;

    // Check if the destination file already exists
    fs1.pathExists(newpath, async function (err, exists) {
      if (exists) {
        console.log("Destination file already exists");
        return res
          .status(400)
          .send({ error: "Destination file already exists" });
      }

      // Move the file to the destination path
      fs1.move(oldpath, newpath, { overwrite: true }, async function (err) {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: "File rename failed" });
        }
        res.status(200).send({ result: "File renamed" });
      });
    });
  });
});

/*
    Route:/api/initialise/saveToDataBase
    incoming data:matched column names database
    respone: 200 if the mtechappl table  is created
    Functionality: initiaises mtechappl table,seatmatrix table
*/

router.post("/saveToDataBase", isAuthenticated, async (req, res) => {
  var filePath = `${userFilePath}/uploadedFile.xlsx`;
  console.log("request body: ", req.body);
  var matchedColumns = req.body.result;
  // console.log(req.body);
  //reading the uploaded file

  try {
    var workbook = XLSX.readFile(filePath);
    var applicantsDataSheet = workbook.Sheets[workbook.SheetNames[0]];
    var applicantsData = XLSX.utils.sheet_to_json(applicantsDataSheet, {
      defval: "",
    });
    var data = [];
    //modyfing the column names
    for (const applicant of applicantsData) {
      row = {};
      for (const uploadedColumn of Object.keys(matchedColumns)) {
        selectedColumn = matchedColumns[uploadedColumn];
        if (selectedColumn != "ignore" && applicant[uploadedColumn] != "") {
          row[selectedColumn] = applicant[uploadedColumn];
        }
      }
      data.push(row);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ result: "Error in reading the uploaded file" });
    return;
  }
  //creating the new excel file with modified column names
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Responses");
  XLSX.writeFile(wb, `${userFilePath}/modifiedFile.xlsx`);
  //initialising the seatmatrix table
  try {
    let res2 = await enterCandidateDetailsToDatabase(
      `${userFilePath}/modifiedFile.xlsx`,
      process.env.MYSQL_DATABASE
    );
    let res1 = await initialiseSeatMatrix(process.env.MYSQL_DATABASE, [
      ["ST_FandM", 0],
      ["ST_Female", 0],
      ["ST_Female_PWD", 0],
      ["ST_FandM_PWD", 0],
      ["SC_FandM", 0],
      ["SC_Female", 0],
      ["SC_Female_PWD", 0],
      ["SC_FandM_PWD", 0],
      ["OBC_FandM", 0],
      ["OBC_Female", 0],
      ["OBC_Female_PWD", 0],
      ["OBC_FandM_PWD", 0],
      ["EWS_FandM", 0],
      ["EWS_Female", 0],
      ["EWS_Female_PWD", 0],
      ["EWS_FandM_PWD", 0],
      ["GEN_FandM", 0],
      ["GEN_Female", 0],
      ["GEN_Female_PWD", 0],
      ["GEN_FandM_PWD", 0],
      ["COMMON_PWD", 0],
    ]);
    let response = await initializeAppicantsStatus(process.env.MYSQL_DATABASE);
    res.status(200).send({ result: "success" });
  } catch (error) {
    console.log(error);
    try {
      let didReset = await resetDatabase();
    } catch (error) {
      console.log(error);
    }
    res.status(500).send({ result: `${error.sqlMessage}` });
  }
});

/*
    Route:/api/initialise/getMatchedColumnNames
    incoming data: --
    respone: json object containing old column name and key as matching column name.to know more see mapColumnNames function.
*/
router.get("/getMatchedColumnNames", isAuthenticated, (req, res) => {
  try {
    var result = mapColumnNames(`${userFilePath}/uploadedFile.xlsx`);
    res.status(200).send({ result: result });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

/*
    Route:/api/initialise/getMasterFileUploadStatus
    incoming data: --
    respone: json object as true if master file uploaded.
*/
router.get("/getMasterFileUploadStatus", isAuthenticated, (req, res) => {
  try {
    //checking if a file exists
    if (fs.existsSync(`${userFilePath}/uploadedFile.xlsx`))
      res.status(200).send({ result: true });
    else res.status(200).send({ result: false });
  } catch (error) {
    console.log(error);
    res.status(500).send({ result: error.message });
  }
});

/*
    Route:/api/initialise/getMasterFileModifiedStatus
    incoming data: --
    respone: json object as true if master file modified.
*/
router.get("/getMasterFileModifiedStatus", isAuthenticated, (req, res) => {
  try {
    // Checking if a file exists
    if (fs.existsSync(`${userFilePath}/modifiedFile.xlsx`))
      res.status(200).send({ result: true });
    else res.status(200).send({ result: false });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

/*
    Route:/api/initialise/reset
    incoming data: --
    functionality:deletes mtechappl,seat matrix table,deletes modified and uploaded files.
*/
router.get("/reset", isAuthenticated, async (req, res) => {
  // Dropping databases
  try {
    const response = await resetDatabase();
    res
      .status(200)
      .send({ result: true, message: "Database reset successful" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ result: false, error: error.message });
  }
});

/*
    Route:/api/initialise/uploadedFile
    incoming data: --
    outgoing data: sends the saved uploaded file
*/
router.get("/uploadedFile", isAuthenticated, async (req, res) => {
  var options = {
    root: path.join(__dirname),
  };
  //sending stored file
  var fileName = `${userFilePath}/uploadedFile.xlsx`;
  res.sendFile(fileName, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Sent:", fileName);
    }
  });
});

/*
    Route:/api/initialise/modifiedFile
    incoming data: --
    outgoing data: sends the saved modifiedFile.
*/
router.get("/modifiedFile", isAuthenticated, async (req, res) => {
  try {
    var options = {
      root: path.join(__dirname),
    };
    // Sending stored file
    var fileName = `${userFilePath}/modifiedFile.xlsx`;
    res.sendFile(fileName, function (err) {
      if (err) {
        console.log(err);
        res.status(500).send({ result: "Failed to send modified file" });
      } else {
        console.log("Sent:", fileName);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ result: "Failed to send modified file" });
  }
});

module.exports = router;
