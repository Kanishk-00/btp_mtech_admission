const { insertManyIntoTable } = require("../sqlqueries");
const { findAvailableSeats } = require("../findAvailableSeats");

async function updateCandidateStatus(con, candidate, offerCat, round, branch) {
  // Define the table name with the branch prefix
  const applicationstatusTable = `${branch.toUpperCase()}_applicationStatus`;

  // Updating the shortlisted candidate's status in the applicationstatus table
  try {
    let valuesToBeInserted = [];
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

    // Inserting values into the applicationstatus table
    if (valuesToBeInserted.length > 0) {
      var x = await insertManyIntoTable(
        con,
        applicationstatusTable,
        "(COAP,Offered,Accepted,OfferedRound,RetainRound,RejectOrAcceptRound,OfferCat,IsOfferPwd)",
        valuesToBeInserted
      );
      console.log(
        `Seat offered to ${candidate.COAP} in ${offerCat} category (COMMON_PWD)`
      );
    }
  } catch (error) {
    throw error;
  }
}

/*
    Name: shortlistCommonPWDCandidates
    Input: connection object to the database, limit on how many members to shortlist, ongoing round, branch
    Output: JSON object containing all the shortlisted candidates.
    Functionality: Shortlists a limited number of EWS candidates based on their max gatescore. 
*/
async function shortlistCommonPWDCandidates(con, limit, round, branch) {
  console.log("8 ke baad aukat dikha di branch ne", branch);
  // Define the table name with the branch prefix
  const mtechapplTable = `${branch.toUpperCase()}_mtechappl`;
  const applicationstatusTable = `${branch.toUpperCase()}_applicationStatus`;
  // Initialize an array to keep track of checked COAP IDs
  var checkedCandidatesCoapID = ["x"];

  // Shortlist candidates until the limit is reached
  while (limit > 0) {
    var checkedCOAPIDs = checkedCandidatesCoapID
      .map((coap) => `'${coap}'`)
      .join(",");

    // Query to fetch shortlisted candidates
    queryString = `SELECT ${mtechapplTable}.COAP, Gender, Category, MaxGateScore, EWS, PWD,
        Offered, 
        Accepted,
        OfferedRound
        FROM ${mtechapplTable}
        LEFT JOIN ${applicationstatusTable}
        ON ${mtechapplTable}.COAP = ${applicationstatusTable}.COAP 
        WHERE Offered IS NULL AND Pwd='Yes' AND ${mtechapplTable}.COAP NOT IN (${checkedCOAPIDs})
        ORDER BY MaxGateScore DESC, HSSCper DESC, SSCper DESC
        LIMIT 1`;

    var shortlistedCandidates;

    // Querying
    try {
      var [shortlistedCandidates] = await con.query(queryString);
      shortlistedCandidates = shortlistedCandidates[0];

      // Exit loop if no more candidates are found
      if (!shortlistedCandidates) {
        break;
      }

      var cat = shortlistedCandidates["Category"];
      const offerCatPrefix = `${cat}_FandM`;
      const offerCatFemale = `${cat}_Female`;

      // Check available seats based on candidate's category and gender
      var seats_male = await findAvailableSeats(
        con,
        offerCatPrefix,
        round,
        branch
      );
      var seats_female = await findAvailableSeats(
        con,
        offerCatFemale,
        round,
        branch
      );

      // Update candidate status based on available seats
      if (shortlistedCandidates.EWS === "Yes") {
        const offerCat =
          seats_female > 0 ? `${offerCatFemale}_PWD` : `${offerCatPrefix}_PWD`;
        try {
          await updateCandidateStatus(
            con,
            shortlistedCandidates,
            offerCat,
            round,
            branch
          );
        } catch (error) {
          throw error;
        }
        limit -= 1;
      } else {
        const offerCat = seats_female > 0 ? offerCatFemale : offerCatPrefix;
        try {
          await updateCandidateStatus(
            con,
            shortlistedCandidates,
            offerCat,
            round,
            branch
          );
        } catch (error) {
          throw error;
        }
        limit -= 1;
      }
      checkedCandidatesCoapID.push(shortlistedCandidates["COAP"]);
    } catch (error) {
      throw error;
    }
  }
  return shortlistedCandidates;
}

module.exports = { shortlistCommonPWDCandidates };
