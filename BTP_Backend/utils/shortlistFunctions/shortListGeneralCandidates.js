const { insertManyIntoTable } = require("../sqlqueries");
var query=require("../sqlqueries").selectQuery;
/*
    Name: shortListGeneralCandidates
    Input : connection object to the database,limit on how many members to shortlist,ongoing round
    output: JSON object containing all the shortlisted candidates.
    Functionality : shortlists limit no of General candidates based on their max gatescore. 
*/
async function shortListGeneralCandidates(con,limit,round){
    //query that is being made to database.
    queryString=`select mtechappl.COAP, Gender, Category, MaxGateScore,
    Offered, 
    Accepted,
    OfferedRound
    from mtechappl
    left join applicationstatus
    on mtechappl.COAP = applicationstatus.COAP 
    where Offered is null
    order by MaxGateScore desc,EWS ASC,HSSCper desc,SSCper desc
    Limit ${limit}`
    //variable to store shortlisted candidates
    var shortlistedCandidates;
    //querying
    try {
        var [shortlistedCandidates]=await con.query(queryString);
        // console.log(shortlistedCandidates);
    } catch (error) {
        throw error;
    }
    // console.log(shortlistedCandidates);
    //updating the shortlisted candidates status in the applicationstatus table.
    try {
        let valuesToBeInserted=[]        
        for (const candidate of shortlistedCandidates) {
          valuesToBeInserted.push([candidate.COAP,'Y','',round,'','',"GEN_FandM"]);
          console.log(`shortlisted ${candidate.COAP} in GEN_FandM category `);
        }
        /*
            updating 
            COAP with shortlisted candidate coap
            offered with 'Y'
            OfferedRound with current round number
            offercat with GEN_FandM
        */ 
        if(valuesToBeInserted.length>0){
            var x= await insertManyIntoTable(con,"applicationstatus","(COAP,Offered,Accepted,OfferedRound,RetainRound,RejectOrAcceptRound,OfferCat)",valuesToBeInserted);
        }
    } catch (error) {
        throw error;
    }
    return shortlistedCandidates;
}
/*
    Name: shortListGeneralFemaleCandidates
    Input : connection object to the database,limit on how many members to shortlist,ongoing round
    output: JSON object containing all the shortlisted candidates.
    Functionality : shortlists limit no of General female candidates based on their max gatescore. 
*/
async function shortListGeneralFemaleCandidates(con,limit,round){
    //query that is being made to database.
    queryString=`select mtechappl.COAP, Gender, Category, MaxGateScore,
    Offered, 
    Accepted,
    OfferedRound
    from mtechappl
    left join applicationstatus
    on mtechappl.COAP = applicationstatus.COAP 
    where Offered is null and Gender = "Female"
    order by MaxGateScore desc,EWS ASC,HSSCper desc,SSCper desc
    Limit ${limit}`
    //variable to store shortlisted candidates
    var shortlistedCandidates;
    //querying
    try {
        var [shortlistedCandidates]=await con.query(queryString);
        // console.log(shortlistedCandidates);
        
    } catch (error) {
        throw error;
    }
    //updating the shortlisted candidates status in the applicationstatus table.
    try {
        let valuesToBeInserted=[]        
        for (const candidate of shortlistedCandidates) {
          valuesToBeInserted.push([candidate.COAP,'Y','',round,'','',"GEN_Female"]);
          console.log(`shortlisted ${candidate.COAP} in GEN_Female category `);
        }
        /*
            updating 
            COAP with shortlisted candidate coap
            offered with 'Y'
            OfferedRound with current round number
            offercat with GEN_Female
        */ 
        if(valuesToBeInserted.length>0){
            var x= await insertManyIntoTable(con,"applicationstatus","(COAP,Offered,Accepted,OfferedRound,RetainRound,RejectOrAcceptRound,OfferCat)",valuesToBeInserted);
        }
    } catch (error) {
        throw error;
    }
    return shortlistedCandidates;
}
//exporting these functions
module.exports={shortListGeneralCandidates,shortListGeneralFemaleCandidates}