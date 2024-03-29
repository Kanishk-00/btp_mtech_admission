const { insertManyIntoTable } = require("../sqlqueries");
var query = require("../sqlqueries").selectQuery;
/*
    Name: updateFemaleCandidatesOfferedCategory
    Input : connection object to the database,no.of seats left in the female category,ongoing round
    output: JSON object containing all the shortlisted candidates.
    Functionality : basd on the given category it tries to upgrade a female candidate who has been allocated a seat in 
    gender-Neutral category to gender-Female category of the same category. 
*/
async function updateFemaleCandidatesOfferedCategory(
  con,
  category,
  round,
  noOfFemaleSeats,
  branch
) {
  const tableName = `mtechappl`;
  const tableName2 = `applicationstatus`;
  //query that is being made to database.
  queryString = `SELECT ${tableName}.COAP, Gender, Category, MaxGateScore,
    Offered, 
    Accepted,
    OfferCat,
    OfferedRound
    FROM ${tableName}
    LEFT JOIN ${tableName2}
    ON ${tableName}.COAP = ${tableName2}.COAP 
    WHERE (Accepted='R' AND OfferCat ='${category}_FandM' AND Gender='Female' AND ${tableName}.branch='${branch}') OR 
    (Accepted='Y' AND OfferCat ='${category}_FandM' AND Gender='Female' AND ${tableName2}.branch='${branch}') 
    ORDER BY MaxGateScore DESC, EWS ASC, HSSCper DESC, SSCper DESC`;
  //variable to store shortlisted candidates
  var shortlistedCandidates;
  //querying
  try {
    var [shortlistedCandidates] = await con.query(queryString);
    // console.log(shortlistedCandidates);
  } catch (error) {
    throw error;
  }
  // console.log(shortlistedCandidates);
  //updating the shortlisted candidates status in the applicationstatus table.
  /*
        Possible updates:- 
        
        Gen_FandM (Female) ->   Gen_Female
        OBC_FandM (Female) ->   OBC_Female 
        SC_FandM (Female)  ->   SC_Female 
        ST_FandM (Female)  ->   ST_Female 
    */
  try {
    let valuesToBeInserted = [];
    while (noOfFemaleSeats > 0) {
      for (const candidate of shortlistedCandidates) {
        const [updateResult] = await con.query(`UPDATE ${tableName2}
          SET OfferedRound=${round}, OfferCat='${category}_Female'
          WHERE COAP = '${candidate.COAP}' AND branch = '${branch}';`);
      }
      noOfFemaleSeats--;
    }
  } catch (error) {
    throw error;
  }
  return shortlistedCandidates;
}

//exporting these functions
module.exports = { updateFemaleCandidatesOfferedCategory };
