var query=require("../sqlqueries").selectQuery;
const { insertManyIntoTable } = require("../sqlqueries");
/*
    Name: shortListEWSCandidates
    Input : connection object to the database,limit on how many members to shortlist,ongoing round
    output: JSON object containing all the shortlisted candidates.
    Functionality : shortlists limit no of EWS candidates based on their max gatescore. 
*/
async function shortListEWSCandidates(con,limit,round){
    //query that is being made to database.
    queryString=`select mtechappl.COAP, Gender, Category, MaxGateScore,
    Offered, 
    Accepted,
    OfferedRound
    from mtechappl
    left join applicationstatus
    on mtechappl.COAP = applicationstatus.COAP 
    where Offered is null and EWS='Yes' and category='GEN'
    order by MaxGateScore desc,HSSCper desc,SSCper desc
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
        //values to be updated
        let valuesToBeInserted=[] 
        /*
              updating 
            COAP with shortlisted candidate coap
            offered with 'Y'
            OfferedRound with current round number
            offercat with EWS_FandM
        */       
        for (const candidate of shortlistedCandidates) {
          valuesToBeInserted.push([candidate.COAP,'Y','',round,'','',"EWS_FandM"]);
          console.log(`seat offered to ${candidate.COAP} in EWS_FandM category `);
        }
        if(valuesToBeInserted.length>0){
            var x= await insertManyIntoTable(con,"applicationstatus","(COAP,Offered,Accepted,OfferedRound,RetainRound,RejectOrAcceptRound,OfferCat)",valuesToBeInserted);
        }
    } catch (error) {
        throw error;
    }
    // returning the shortlisted candidates
    return shortlistedCandidates;

}
/*
    Name: shortListEWSFemaleCandidates
    Input : connection object to the database,limit on how many members to shortlist,ongoing round
    output: JSON object containing all the shortlisted candidates.
    Functionality : shortlists limit no of EWS Female candidates based on their max gatescore. 
*/
async function shortListEWSFemaleCandidates(con,limit,round){
    //query that is being made to database.
    queryString=`select mtechappl.COAP, Gender, Category, MaxGateScore,
    Offered, 
    Accepted,
    OfferedRound
    from mtechappl
    left join applicationstatus
    on mtechappl.COAP = applicationstatus.COAP 
    where Offered is null and Gender = "Female" and EWS='Yes' and category="GEN"
    order by MaxGateScore desc,HSSCper desc,SSCper desc
    Limit ${limit}`
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
          valuesToBeInserted.push([candidate.COAP,'Y','',round,'','',"EWS_Female"]);
          console.log(`seat offered to ${candidate.COAP} in EWS_Female category `);
        }
        /*
            updating 
            COAP with shortlisted candidate coap
            offered with 'Y'
            OfferedRound with current round number
            offercat with EWS_Female
        */ 
        if(valuesToBeInserted.length>0){
            var x= await insertManyIntoTable(con,"applicationstatus","(COAP,Offered,Accepted,OfferedRound,RetainRound,RejectOrAcceptRound,OfferCat)",valuesToBeInserted);
        }
    } catch (error) {
        throw error;
    }
    // returning the shortlisted candidates
    return shortlistedCandidates;

}
module.exports={shortListEWSCandidates,shortListEWSFemaleCandidates}