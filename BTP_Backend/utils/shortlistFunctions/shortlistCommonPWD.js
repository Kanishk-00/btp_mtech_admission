const { insertManyIntoTable } = require("../sqlqueries");
const { findAvailableSeats } = require("../findAvailableSeats");

async function updateCandidateStatus(con, candidate, offerCat, round, branch) {
  try {
    const applicationstatusTable = `applicationstatus`;

    let valuesToBeInserted = [
      [candidate.COAP, "Y", "", round, "", "", offerCat, "Y"],
    ];

    if (valuesToBeInserted.length > 0) {
      valuesToBeInserted.forEach((candidate) => {
        candidate.push(branch);
      });

      await insertManyIntoTable(
        con,
        applicationstatusTable,
        "(COAP,Offered,Accepted,OfferedRound,RetainRound,RejectOrAcceptRound,OfferCat,IsOfferPwd,branch)",
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

async function shortlistCommonPWDCandidates(con, limit, round, branch) {
  console.log("8 ke baad aukat dikha di branch ne", branch);
  const mtechapplTable = `mtechappl`;
  const applicationstatusTable = `applicationstatus`;

  var checkedCandidatesCoapID = ["x"];

  while (limit > 0) {
    var checkedCOAPIDs = checkedCandidatesCoapID
      .map((coap) => `'${coap}'`)
      .join(",");

    queryString = `SELECT ${mtechapplTable}.COAP, Gender, Category, MaxGateScore, EWS, PWD,
        Offered, 
        Accepted,
        OfferedRound
        FROM ${mtechapplTable}
        LEFT JOIN ${applicationstatusTable}
        ON ${mtechapplTable}.COAP = ${applicationstatusTable}.COAP 
        WHERE Offered IS NULL AND Pwd='Yes' AND ${mtechapplTable}.COAP NOT IN (${checkedCOAPIDs})
        AND ${mtechapplTable}.branch = '${branch}'  /* Added condition */
        ORDER BY MaxGateScore DESC, HSSCper DESC, SSCper DESC
        LIMIT 1`;

    var shortlistedCandidates;

    try {
      var [shortlistedCandidates] = await con.query(queryString);
      shortlistedCandidates = shortlistedCandidates[0];

      if (!shortlistedCandidates) {
        break;
      }

      var cat = shortlistedCandidates["Category"];
      const offerCatPrefix = `${cat}_FandM`;
      const offerCatFemale = `${cat}_Female`;

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

      if (shortlistedCandidates.EWS === "Yes") {
        const offerCat =
          seats_female > 0 ? `${offerCatFemale}_PWD` : `${offerCatPrefix}_PWD`;
        await updateCandidateStatus(
          con,
          shortlistedCandidates,
          offerCat,
          round,
          branch
        );
        limit -= 1;
      } else {
        const offerCat = seats_female > 0 ? offerCatFemale : offerCatPrefix;
        await updateCandidateStatus(
          con,
          shortlistedCandidates,
          offerCat,
          round,
          branch
        );
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
