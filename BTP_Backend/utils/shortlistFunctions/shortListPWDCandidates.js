const { insertManyIntoTable } = require("../sqlqueries");

/*
    Name: shortListPWDCandidates
    Input : connection object to the database, limit on how many members to shortlist, ongoing round, category, offerCat, branch
    Output: JSON object containing all the shortlisted candidates.
    Functionality: Shortlists a limited number of PWD candidates based on their max gatescore. 
*/
async function shortListPWDCandidates(
  con,
  limit,
  round,
  category,
  offerCat,
  branch
) {
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
    WHERE Offered IS NULL AND Pwd='Yes' AND category REGEXP '${category}'
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
        offerCat,
        "Y",
      ]);
      console.log(`Shortlisted ${candidate.COAP} in ${offerCat} category`);
    }

    // Inserting values into the applicationstatus table
    if (valuesToBeInserted.length > 0) {
      var x = await insertManyIntoTable(
        con,
        applicationstatusTable,
        "(COAP,Offered,Accepted,OfferedRound,RetainRound,RejectOrAcceptRound,OfferCat,IsOfferPwd)",
        valuesToBeInserted
      );
    }
  } catch (error) {
    throw error;
  }
  return shortlistedCandidates;
}

/*
    Name: shortListEWSPWDCandidates
    Input : connection object to the database, limit on how many members to shortlist, ongoing round, category, offerCat, branch
    Output: JSON object containing all the shortlisted candidates.
    Functionality: Shortlists a limited number of EWS_PWD candidates based on their max gatescore. 
*/
async function shortListEWSPWDCandidates(
  con,
  limit,
  round,
  category,
  offerCat,
  branch
) {
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
    WHERE Offered IS NULL AND Pwd='Yes' AND EWS='Yes' AND category='GEN'
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
        offerCat,
        "Y",
      ]);
      console.log(`Shortlisted ${candidate.COAP} in ${offerCat} category`);
    }

    // Inserting values into the applicationstatus table
    if (valuesToBeInserted.length > 0) {
      var x = await insertManyIntoTable(
        con,
        applicationstatusTable,
        "(COAP,Offered,Accepted,OfferedRound,RetainRound,RejectOrAcceptRound,OfferCat,IsOfferPwd)",
        valuesToBeInserted
      );
    }
  } catch (error) {
    throw error;
  }
  return shortlistedCandidates;
}

/*
    Name: shortListPWDFemaleCandidates
    Input : connection object to the database, limit on how many members to shortlist, ongoing round, branch
    Output: JSON object containing all the shortlisted candidates.
    Functionality: Shortlists a limited number of PWD Female candidates based on their max gatescore. 
*/
async function shortListPWDFemaleCandidates(con, limit, round, branch) {
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
    WHERE Offered IS NULL AND Gender = "Female" AND Pwd='Yes'
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
        "PWD_Female",
        "Y",
      ]);
      console.log(`Shortlisted ${candidate.COAP} in PWD_Female category`);
    }

    // Inserting values into the applicationstatus table
    if (valuesToBeInserted.length > 0) {
      var x = await insertManyIntoTable(
        con,
        applicationstatusTable,
        "(COAP,Offered,Accepted,OfferedRound,RetainRound,RejectOrAcceptRound,OfferCat,IsOfferPwd)",
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
  shortListPWDCandidates,
  shortListPWDFemaleCandidates,
  shortListEWSPWDCandidates,
};
