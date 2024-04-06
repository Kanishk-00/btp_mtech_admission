const XLSX = require("xlsx");
const mysql = require("mysql2");
const { selectQuery } = require("./sqlqueries");

async function updateDecision(
  con,
  applicant,
  round,
  coapIdColumnName,
  candidateDecisonColumnName,
  branch
) {
  const currCOAP = applicant[coapIdColumnName];
  const currDecision = applicant[candidateDecisonColumnName];
  console.log(currCOAP, currDecision);
  try {
    const query = `SELECT OfferedRound, RetainRound, RejectOrAcceptRound FROM applicationstatus WHERE COAP = ? AND branch = ?;`;
    console.log("Query:", query, "Parameters:", [currCOAP, branch]);
    const [checkPreviousStatus] = await con.query(query, [currCOAP, branch]);
    console.log("Query result:", checkPreviousStatus);
    if (checkPreviousStatus.length === 0) {
      try {
        const insertQuery = `INSERT INTO applicationstatus (COAP, Offered, Accepted, RejectOrAcceptRound, branch) VALUES (?, '', 'E', ?, ?)`;
        console.log("Insert Query:", insertQuery, "Parameters:", [
          currCOAP,
          round,
          branch,
        ]);
        await con.query(insertQuery, [currCOAP, round, branch]);
      } catch (error) {
        throw error;
      }
    }
  } catch (error) {
    throw error;
  }
  console.log(`Updated candidate decision ${currCOAP}`);
}

async function updateStatusConsolidatedFile(
  databaseName,
  filePath,
  round,
  coapIdColumnName,
  candidateDecisonColumnName,
  branch
) {
  const con = mysql
    .createPool({
      host: process.env.MYSQL_HOSTNAME,
      user: "root",
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    })
    .promise();
  const workbook = XLSX.readFile(filePath);
  const applicantsDataSheet = workbook.Sheets[workbook.SheetNames[0]];
  const applicantsData = XLSX.utils.sheet_to_json(applicantsDataSheet);
  for (const applicant of applicantsData) {
    try {
      // console.log("branch1kanishkkkk: ", branch);
      // console.log("branch1kanishkkkk2: ", applicant[coapIdColumnName]);
      const query = `SELECT COUNT(*) AS count FROM mtechappl WHERE COAP = ? AND branch = ?;`;
      // console.log("Query:", query, "Parameters:", [
      //   applicant[coapIdColumnName],
      //   branch,
      // ]);
      const [isCS] = await con.query(query, [
        applicant[coapIdColumnName],
        branch,
      ]);
      // console.log("Query result:", isCS);
      if (isCS[0].count !== 0) {
        console.log("branch1kanishkkkk mahan: ", branch);
        console.log("branch1kanishkkkk2 mahan: ", applicant[coapIdColumnName]);
        console.log("Query result mahan:", isCS);
      }

      if (isCS[0].count === 1) {
        await updateDecision(
          con,
          applicant,
          round,
          coapIdColumnName,
          candidateDecisonColumnName,
          branch
        );
      }
    } catch (error) {
      throw error;
    }
  }

  // snap shot logic
  try {
    const sqlQuery2 = `DELETE FROM round${round} WHERE branch = '${branch}'`;
    const res2 = await con.query(sqlQuery2);
    console.log("Query 2");

    const sqlQuery3 = `INSERT INTO round${round} SELECT * FROM applicationstatus WHERE branch = '${branch}'`;
    const res3 = await con.query(sqlQuery3);
    console.log("Query 3");
    
  } catch (error) {
    throw error;
  }
  
}

module.exports = { updateStatusConsolidatedFile };
