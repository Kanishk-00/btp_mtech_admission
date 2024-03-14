const { insertManyIntoTable } = require("../sqlqueries");

/*
    Name: shortListEWSCandidates
    Input : connection object to the database, limit on how many members to shortlist, ongoing round, branch
    Output: JSON object containing all the shortlisted candidates.
    Functionality: Shortlists a limited number of EWS candidates based on their max gatescore.
*/
async function shortListEWSCandidates(con, limit, round, branch) {
  // Define the table names with the branch prefix
  const mtechapplTable = `${branch}_mtechappl`;
  const applicationstatusTable = `${branch}_applicationstatus`;

  // Query to fetch shortlisted candidates
  queryString = `SELECT ${mtechapplTable}.COAP, Gender, Category, MaxGateScore,
    Offered, 
    Accepted,
    OfferedRound
    FROM ${mtechapplTable}
    LEFT JOIN ${applicationstatusTable}
    ON ${mtechapplTable}.COAP = ${applicationstatusTable}.COAP 
    WHERE Offered IS NULL AND EWS='Yes' AND category='GEN'
    ORDER BY MaxGateScore DESC, HSSCper DESC, SSCper DESC
    LIMIT ${limit}`;

  // Variable to store shortlisted candidates
  var shortlistedCandidates;
  // Querying
  try {
    var [shortlistedCandidates] = await con.query(queryString);
  } catch (error) {
    throw error;
  }

  // Updating the shortlisted candidates' status in the applicationstatus table
  try {
    // Values to be updated
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
    // Inserting values into the applicationstatus table
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
  // Returning the shortlisted candidates
  return shortlistedCandidates;
}

/*
    Name: shortListEWSFemaleCandidates
    Input : connection object to the database, limit on how many members to shortlist, ongoing round, branch
    Output: JSON object containing all the shortlisted candidates.
    Functionality: Shortlists a limited number of EWS Female candidates based on their max gatescore.
*/
async function shortListEWSFemaleCandidates(con, limit, round, branch) {
  // Define the table names with the branch prefix
  const mtechapplTable = `${branch}_mtechappl`;
  const applicationstatusTable = `${branch}_applicationstatus`;

  // Query to fetch shortlisted candidates
  queryString = `SELECT ${mtechapplTable}.COAP, Gender, Category, MaxGateScore,
    Offered, 
    Accepted,
    OfferedRound
    FROM ${mtechapplTable}
    LEFT JOIN ${applicationstatusTable}
    ON ${mtechapplTable}.COAP = ${applicationstatusTable}.COAP 
    WHERE Offered IS NULL AND Gender = "Female" AND EWS='Yes' AND category="GEN"
    ORDER BY MaxGateScore DESC, HSSCper DESC, SSCper DESC
    LIMIT ${limit}`;

  // Variable to store shortlisted candidates
  var shortlistedCandidates;
  // Querying
  try {
    var [shortlistedCandidates] = await con.query(queryString);
  } catch (error) {
    throw error;
  }

  // Updating the shortlisted candidates' status in the applicationstatus table
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
    // Inserting values into the applicationstatus table
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
  // Returning the shortlisted candidates
  return shortlistedCandidates;
}

module.exports = { shortListEWSCandidates, shortListEWSFemaleCandidates };
