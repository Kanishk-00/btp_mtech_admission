const { insertManyIntoTable } = require("../sqlqueries");

async function shortListEWSCandidates(con, limit, round, branch) {
  const mtechapplTable = `mtechappl`;
  const applicationstatusTable = `applicationstatus`;

  queryString = `SELECT ${mtechapplTable}.COAP, Gender, Category, MaxGateScore,
    Offered, 
    Accepted,
    OfferedRound
    FROM ${mtechapplTable}
    LEFT JOIN ${applicationstatusTable}
    ON ${mtechapplTable}.COAP = ${applicationstatusTable}.COAP 
    WHERE Offered IS NULL AND EWS='Yes' AND category='GEN' AND ${mtechapplTable}.branch = '${branch}'
    ORDER BY MaxGateScore DESC, HSSCper DESC, SSCper DESC
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
      valuesToBeInserted.push([
        candidate.COAP,
        "Y",
        "",
        round,
        "",
        "",
        "EWS_FandM",
      ]);
      console.log(`Seat offered to ${candidate.COAP} in EWS_FandM category`);
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

async function shortListEWSFemaleCandidates(con, limit, round, branch) {
  const mtechapplTable = `mtechappl`;
  const applicationstatusTable = `applicationstatus`;

  queryString = `SELECT ${mtechapplTable}.COAP, Gender, Category, MaxGateScore,
    Offered, 
    Accepted,
    OfferedRound
    FROM ${mtechapplTable}
    LEFT JOIN ${applicationstatusTable}
    ON ${mtechapplTable}.COAP = ${applicationstatusTable}.COAP 
    WHERE Offered IS NULL AND Gender = "Female" AND EWS='Yes' AND category="GEN" AND ${mtechapplTable}.branch = '${branch}'
    ORDER BY MaxGateScore DESC, HSSCper DESC, SSCper DESC
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
      valuesToBeInserted.push([
        candidate.COAP,
        "Y",
        "",
        round,
        "",
        "",
        "EWS_Female",
      ]);
      console.log(`Seat offered to ${candidate.COAP} in EWS_Female category`);
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

module.exports = { shortListEWSCandidates, shortListEWSFemaleCandidates };
