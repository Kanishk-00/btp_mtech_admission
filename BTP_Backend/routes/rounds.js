const router = require("express").Router();
const path = require("path");
const fs = require("fs");
var fs1 = require("fs-extra");

const e = require("express");
const userFilePath = path.join(__dirname, "..", "files");
const { generateOffers } = require("../utils/generateOffers");
const generatedOffersDirectoryPath = path.join(
  __dirname,
  "..",
  "files",
  "generatedOffers"
);
const updatesFromRoundsDirectoryPath = path.join(
  __dirname,
  "..",
  "files",
  "roundUpdates"
);
const { updateStatusIITGList } = require("../utils/updateStatusIITGList.js");
const {
  updateStatusIITGNotInterested,
} = require("../utils/updateStatusIITGNotIntersted.js");
const {
  updateStatusConsolidatedFile,
} = require("../utils/updateStatusConsolidatedFile.js");
const { selectQuery } = require("../utils/sqlqueries");
const { resetRound } = require("../utils/resetRound");
var mysql = require("mysql2");
const XLSX = require("xlsx");
const formidable = require("formidable");
const isAuthenticated = require("../middleware/authMiddleware.js");
// const { Console } = require("console");
/*
    Function name:getFilesInDirectory
    input : directory path
    output: files present in that directory
*/
const getFilesInDirectory = (directoryPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, function (err, files) {
      //handling error
      // console.log("filePath:",directoryPath);
      if (err) {
        reject("Unable to scan directory: " + err);
      } else {
        resolve(files);
      }
    });
  });
};
/*
    Route:/api/rounds/getRounds
    incoming data: --
    outgoing data: sends the current round.
*/
router.get("/getRounds", isAuthenticated, async (req, res) => {
  let OffersfilesList = [];
  let updatesFromRoundsFiles = [];
  try {
    //reading files from generateoffers directory
    OffersfilesList = await getFilesInDirectory(generatedOffersDirectoryPath);
  } catch (error) {
    console.log(error);
    res.status(500).send({ result: "Internal Server Error" });
  }
  try {
    //reading files from updateRounds directory
    updatesFromRoundsFiles = await getFilesInDirectory(
      updatesFromRoundsDirectoryPath
    );
  } catch (error) {
    console.log(error);
    res.status(500).send({ result: "Internal Server Error" });
  }
  //based on the files in generatedOffersDirectory and updatesFromRoundsDirectory returning the round number
  //popping to ignore the .gitignore files
  if (OffersfilesList.includes(".gitignore")) {
    OffersfilesList.splice(OffersfilesList.indexOf(".gitignore"), 1);
  }
  if (updatesFromRoundsFiles.includes(".gitignore")) {
    updatesFromRoundsFiles.splice(
      updatesFromRoundsFiles.indexOf(".gitignore"),
      1
    );
  }
  // console.log(OffersfilesList,updatesFromRoundsFiles);
  if (
    OffersfilesList.length === 0 ||
    updatesFromRoundsFiles.length === 3 * OffersfilesList.length
  ) {
    res.status(200).send({ rounds: OffersfilesList.length + 1 });
  } else {
    res.status(200).send({ rounds: OffersfilesList.length });
  }
});

/*
    Route:/api/rounds/getRoundDetails/roundId
    incoming data: round number in link
    outgoing data: sends the current round status on how manuy files are uploaded and whether the offers are generated or not.
    {
        offersGenerated:True/false,
        updatedRounds:True/false,
        IITGCandidateDecision:True/false,
        IITGOfferedButNotInterested:True/false,
        ConsolidatedFile:True/false,
    }
*/
router.get("/getRoundDetails/:roundId", isAuthenticated, async (req, res) => {
  let roundId = req.params.roundId;
  let OffersfilesList = [];
  let updatesFromRoundsFiles = [];
  let response = {
    offersGenerated: false,
    updatedRounds: false,
    IITGCandidateDecision: false,
    IITGOfferedButNotInterested: false,
    ConsolidatedFile: false,
  };
  try {
    // Reading files from generateoffers directory
    OffersfilesList = await getFilesInDirectory(generatedOffersDirectoryPath);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ result: "Internal Server Error" });
  }
  try {
    // Reading files from update rounds directory
    updatesFromRoundsFiles = await getFilesInDirectory(
      updatesFromRoundsDirectoryPath
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send({ result: "Internal Server Error" });
  }
  // Checking if offers are generated
  if (OffersfilesList.includes(`round${roundId}.xlsx`)) {
    response.offersGenerated = true;
  }
  // Checking for updates
  if (
    updatesFromRoundsFiles.includes(
      `round${roundId}_IITGCandidateDecision.xlsx`
    )
  ) {
    response.IITGCandidateDecision = true;
  }
  if (
    updatesFromRoundsFiles.includes(
      `round${roundId}_IITGOfferedButNotInterested.xlsx`
    )
  ) {
    response.IITGOfferedButNotInterested = true;
  }
  if (
    updatesFromRoundsFiles.includes(`round${roundId}_ConsolidatedFile.xlsx`)
  ) {
    response.ConsolidatedFile = true;
  }
  res.status(200).send({ result: response });
});

/*
    Route:/api/rounds/generateOffers/roundId
    incoming data: round number in link
    outgoing data: success if offers generated 
*/
router.get("/generateOffers/:roundId", isAuthenticated, async (req, res) => {
  let roundId = req.params.roundId;
  // console.log("generate",roundId);
  console.log(`Generating... round ${roundId} results`);
  try {
    fs.writeFile(
      `${generatedOffersDirectoryPath}/round${roundId}.xlsx`,
      ``,
      (error) => {
        if (error) {
          console.log(error);
        }
      }
    );

    let generated = await generateOffers(
      process.env.MYSQL_DATABASE,
      roundId,
      `${generatedOffersDirectoryPath}/round${roundId}.xlsx`
    );
    res.status(200).send({ result: "Offers Generated Successfully" });
  } catch (error) {
    try {
      let result = await resetRound(roundId);
    } catch (error) {
      console.log(error);
    }
    res.status(500).send({ result: "Internal Server Error" });
  }
});

/*
    Route:/api/rounds/putFile/fileName/roundNumber
    incoming data: round number in link,filename
    outgoing data: success if offers generated 
    functionality: saves the files based on the file name and updates the status
    //error checking should be implemented
*/
router.post("/putFile/:fileName/:roundNumber", async (req, res) => {
  console.log("putfile");
  let roundNumber = req.params.roundNumber;
  let fileName = req.params.fileName;
  var form = new formidable.IncomingForm();
  //parsing file using formiddable library
  let x = form.parse(req, async function (err, fields, files) {
    var oldpath = files.file.filepath;
    var candidateDecisonColumnName = fields.candidateDecision;
    var coapIdColumnName = fields.coap;
    // console.log(fields);
    // console.log("idcoap",coapIdColumnName);
    // console.log("decision",candidateDecisonColumnName);
    var newpath = `${updatesFromRoundsDirectoryPath}/round${roundNumber}_${fileName}.xlsx`;
    console.log("oldPath", oldpath);
    // console.log("new function start");
    fs1.move(oldpath, newpath, async function (err) {
      if (err) {
        console.log(err);
      }
      //saving the file based on the input file name and calling updates status function
      try {
        if (fileName === "IITGCandidateDecision") {
          updateStatusIITGList(
            process.env.MYSQL_DATABASE,
            newpath,
            roundNumber,
            coapIdColumnName,
            candidateDecisonColumnName
          );
        } else if (fileName === "IITGOfferedButNotInterested") {
          updateStatusIITGNotInterested(
            process.env.MYSQL_DATABASE,
            newpath,
            roundNumber,
            coapIdColumnName,
            candidateDecisonColumnName
          );
        } else if (fileName === "ConsolidatedFile") {
          updateStatusConsolidatedFile(
            process.env.MYSQL_DATABASE,
            newpath,
            roundNumber,
            coapIdColumnName,
            candidateDecisonColumnName
          );
        }
        res.status(200).send({});
      } catch (error) {
        res.status(500).send({});
      }
    });
  });
});
/*
    Route:/api/rounds/getFile/roundNumber
    incoming data: round number in link,filename
    outgoing data: saved generated file
*/
router.get("/getFile/:roundNumber", isAuthenticated, async (req, res) => {
  let roundNumber = req.params.roundNumber;
  let queriedfileName = req.params.fileName;
  var fileName = `${generatedOffersDirectoryPath}/round${roundNumber}.xlsx`;
  res.sendFile(fileName, function (err) {
    if (err) {
      console.log(err);
      res.status(500).send({ error: "Internal Server Error" });
    } else {
      console.log(`Sent ${fileName} details`);
    }
  });
});

/*
    Route:/api/rounds/getFile/fileName/roundNumber
    incoming data: round number in link,filename
    outgoing data: saved updated statuses  file
*/
router.get(
  "/getFile/:fileName/:roundNumber",
  isAuthenticated,
  async (req, res) => {
    let roundNumber = req.params.roundNumber;
    let queriedfileName = req.params.fileName;
    var fileName = `${generated}/round${roundNumber}_${queriedfileName}.xlsx`;
    res.sendFile(fileName, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Sent:", fileName);
      }
    });
  }
);
/*
    Route:/api/rounds/reset/roundNumber
    incoming data: round number in link
    outgoing data: Resets the round
*/
router.get("/reset/:roundNumber", isAuthenticated, async (req, res) => {
  let roundNumber = req.params.roundNumber;
  try {
    let result = await resetRound(roundNumber);
    console.log(`Reseted Round Number:${roundNumber}`);
    res.status(200).send({ result: `Reseted Round Number:${roundNumber}` });
  } catch (error) {
    console.error(error);
    res.status(500).send({ result: "Internal Server Error" });
  }
});

/*
    Route:/api/round/getColumnNames
    incoming data: round number in link,filename
    outgoing data: saved generated file
*/
router.post("/getColumnNames", isAuthenticated, async (req, res) => {
  var form = new formidable.IncomingForm();
  //parsing file using formidable library
  let x = form.parse(req, async function (err, fields, files) {
    var oldpath = files.file.filepath;
    var newpath = `${"intermediate"}.xlsx`;
    console.log("oldPath", oldpath);
    // console.log("new function start");
    fs1.move(oldpath, newpath, async function (err) {
      if (err) {
        console.log(err);
      }
      //saving the file based on the input file name and calling updates status function
      try {
        // console.log("inside try");

        var workbook = XLSX.readFile(newpath);
        var statussheet = workbook.Sheets[workbook.SheetNames[0]];
        //making sure that we get all the column values/names.
        var applicantsData = XLSX.utils.sheet_to_json(statussheet, {
          header: 1,
        });
        // console.log(applicantsData);
        var columnNames = applicantsData[0];
        if (fs.existsSync(newpath)) {
          fs.unlink(newpath, (err) => {
            if (err) throw err;
            console.log(`${newpath} was deleted`);
          });
        }
        // console.log(columnNames);
        res.status(200).send({ result: columnNames });
      } catch (error) {
        console.log(error);
        res.status(500).send({});
      }
    });
  });
});
module.exports = router;
