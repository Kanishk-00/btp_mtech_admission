const { insertManyIntoTable } = require("../sqlqueries");

/*
    Name: shortListGeneralCandidates
    Input : connection object to the database, limit on how many members to shortlist, ongoing round, branch
    Output: JSON object containing all the shortlisted candidates.
    Functionality: Shortlists a limited number of General candidates based on their max gatescore. 
*/
async function shortListGeneralCandidates(con, limit, round, branch) {
  const mtechapplTable = `mtechappl`;
  const applicationstatusTable = `applicationstatus`;

  queryString = `SELECT ${mtechapplTable}.COAP, Gender, Category, MaxGateScore,
    Offered, 
    Accepted,
    OfferCat,
    OfferedRound
    FROM ${mtechapplTable}
    LEFT JOIN ${applicationstatusTable}
    ON ${mtechapplTable}.COAP = ${applicationstatusTable}.COAP 
    WHERE Offered IS NULL OR (Accepted='R' AND OfferCat != 'GEN_Female') OR (Accepted='Y' AND OfferCat != 'GEN_Female') AND ${mtechapplTable}.branch = '${branch}'
    ORDER BY MaxGateScore DESC, EWS ASC, HSSCper DESC, SSCper DESC
    LIMIT ${limit}`;

  var shortlistedCandidates;

  try {
    var [shortlistedCandidates] = await con.query(queryString);
  } catch (error) {
    throw error;
  }

  try {
    let valuesToBeInserted = [];
    for (const candidate of shortlistedCandidates) {
      // Category upgrade
      if (
        candidate["Accepted"] &&
        (candidate["Accepted"] == "R" || candidate["Accepted"] == "Y")
      ) {
        if (
          candidate["OfferCat"] != "GEN_FandM" &&
          candidate["OfferCat"] != "GEN_Female"
        ) {
          const [updateResult] =
            await con.query(`UPDATE ${applicationstatusTable}
                    SET OfferedRound = ${round}, OfferCat = "GEN_FandM"
                    WHERE COAP = '${candidate.COAP}';`);
        }
      } else {
        // Normal allocation
        valuesToBeInserted.push([
          candidate.COAP,
          "Y",
          "",
          round,
          "",
          "",
          "GEN_FandM",
        ]);
        console.log(`Shortlisted ${candidate.COAP} in GEN_FandM category`);
      }
    }

    if (valuesToBeInserted.length > 0) {
      var x = await insertManyIntoTable(
        con,
        applicationstatusTable,
        "(COAP,Offered,Accepted,OfferedRound,RetainRound,RejectOrAcceptRound,OfferCat)",
        valuesToBeInserted
      );
    }
  } catch (error) {
    throw error;
  }
  return shortlistedCandidates;
}

/*
    Name: shortListGeneralFemaleCandidates
    Input : connection object to the database, limit on how many members to shortlist, ongoing round, branch
    Output: JSON object containing all the shortlisted candidates.
    Functionality: Shortlists a limited number of General female candidates based on their max gatescore. 
*/
async function shortListGeneralFemaleCandidates(con, limit, round, branch) {
  const mtechapplTable = `mtechappl`;
  const applicationstatusTable = `applicationstatus`;

  queryString = `SELECT ${mtechapplTable}.COAP, Gender, Category, MaxGateScore,
    Offered, 
    Accepted,
    OfferCat,
    OfferedRound
    FROM ${mtechapplTable}
    LEFT JOIN ${applicationstatusTable}
    ON ${mtechapplTable}.COAP = ${applicationstatusTable}.COAP 
    WHERE (Offered IS NULL OR Accepted='R' OR Accepted='Y') AND Gender = "Female" AND ${mtechapplTable}.branch = '${branch}'
    ORDER BY MaxGateScore DESC, EWS ASC, HSSCper DESC, SSCper DESC
    LIMIT ${limit}`;

  var shortlistedCandidates;

  try {
    var [shortlistedCandidates] = await con.query(queryString);
  } catch (error) {
    throw error;
  }

  try {
    let valuesToBeInserted = [];
    for (const candidate of shortlistedCandidates) {
      // Category upgrade
      if (
        candidate["Accepted"] &&
        (candidate["Accepted"] == "R" || candidate["Accepted"] == "Y")
      ) {
        if (candidate["OfferCat"] != "GEN_Female") {
          const [updateResult] =
            await con.query(`UPDATE ${applicationstatusTable}
                    SET OfferedRound = ${round}, OfferCat = "GEN_Female"
                    WHERE COAP = '${candidate.COAP}';`);
        }
      } else {
        // Normal allocation
        valuesToBeInserted.push([
          candidate.COAP,
          "Y",
          "",
          round,
          "",
          "",
          "GEN_Female",
        ]);
        console.log(`Shortlisted ${candidate.COAP} in GEN_Female category`);
      }
    }

    if (valuesToBeInserted.length > 0) {
      var x = await insertManyIntoTable(
        con,
        applicationstatusTable,
        "(COAP,Offered,Accepted,OfferedRound,RetainRound,RejectOrAcceptRound,OfferCat)",
        valuesToBeInserted
      );
    }
  } catch (error) {
    throw error;
  }
  return shortlistedCandidates;
}

// Exporting these functions
module.exports = {
  shortListGeneralCandidates,
  shortListGeneralFemaleCandidates,
};
