var query=require("../sqlqueries").selectQuery;
const { insertManyIntoTable } = require("../sqlqueries");
/*
    Name: shortListPWDCandidates
    Input : connection object to the database,limit on how many members to shortlist,ongoing round
    output: JSON object containing all the shortlisted candidates.
    Functionality : shortlists limit no of PWD candidates based on their max gatescore. 
*/
async function shortListPWDCandidates(con,limit,round,category,offerCat){
    //query that is being made to database.
    queryString=`select mtechappl.COAP, Gender, Category, MaxGateScore,
    Offered, 
    Accepted,
    OfferedRound
    from mtechappl
    left join applicationstatus
    on mtechappl.COAP = applicationstatus.COAP 
    where Offered is null and Pwd='Yes' and category REGEXP '${category}'
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
        let valuesToBeInserted=[]        
        for (const candidate of shortlistedCandidates) {
          valuesToBeInserted.push([candidate.COAP,'Y','',round,'','',offerCat,'Y']);
          console.log(`shortlisted ${candidate.COAP} in ${offerCat} category `);

        }
        /*
            updating 
            COAP with shortlisted candidate coap
            offered with 'Y'
            OfferedRound with current round number
            offercat with PWD_FandM
            IsOfferPwd with Y
        */ 
        if(valuesToBeInserted.length>0){
            var x= await insertManyIntoTable(con,"applicationstatus","(COAP,Offered,Accepted,OfferedRound,RetainRound,RejectOrAcceptRound,OfferCat,IsOfferPwd)",valuesToBeInserted);
        }
    } catch (error) {
        throw error;
    }
    return shortlistedCandidates;

}
/*
    Name: shortListEWSPWDCandidates
    Input : connection object to the database,limit on how many members to shortlist,ongoing round
    output: JSON object containing all the shortlisted candidates.
    Functionality : shortlists limit no of EWS_PWD candidates based on their max gatescore. 
*/
async function shortListEWSPWDCandidates(con,limit,round,category,offerCat){
    //query that is being made to database.
    queryString=`select mtechappl.COAP, Gender, Category, MaxGateScore,
    Offered, 
    Accepted,
    OfferedRound
    from mtechappl
    left join applicationstatus
    on mtechappl.COAP = applicationstatus.COAP 
    where Offered is null and Pwd='Yes' and EWS='Yes' and category='GEN'
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
        let valuesToBeInserted=[]        
        for (const candidate of shortlistedCandidates) {
          valuesToBeInserted.push([candidate.COAP,'Y','',round,'','',offerCat,'Y']);
          console.log(`shortlisted ${candidate.COAP} in ${offerCat} category `);
        }
        /*
            updating 
            COAP with shortlisted candidate coap
            offered with 'Y'
            OfferedRound with current round number
            offercat with PWD_FandM
            IsOfferPwd with Y
        */ 
        if(valuesToBeInserted.length>0){
            var x= await insertManyIntoTable(con,"applicationstatus","(COAP,Offered,Accepted,OfferedRound,RetainRound,RejectOrAcceptRound,OfferCat,IsOfferPwd)",valuesToBeInserted);
            
        }
    } catch (error) {
        throw error;
    }
    return shortlistedCandidates;

}
/*
    Name: shortListPWDFemaleCandidates
    Input : connection object to the database,limit on how many members to shortlist,ongoing round
    output: JSON object containing all the shortlisted candidates.
    Functionality : shortlists limit no of PWD Female candidates based on their max gatescore. 
*/
async function shortListPWDFemaleCandidates(con,limit,round){
    //query that is being made to database.
    queryString=`select mtechappl.COAP, Gender, Category, MaxGateScore,
    Offered, 
    Accepted,
    OfferedRound
    from mtechappl
    left join applicationstatus
    on mtechappl.COAP = applicationstatus.COAP 
    where Offered is null and Gender = "Female" and Pwd='Yes'
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
        let valuesToBeInserted=[]        
        for (const candidate of shortlistedCandidates) {
          valuesToBeInserted.push([candidate.COAP,'Y','',round,'','',"PWD_Female",'Y']);
          console.log(`shortlisted ${candidate.COAP} in PWD_Female category `);
        }
        /*
            updating 
            COAP with shortlisted candidate coap
            offered with 'Y'
            OfferedRound with current round number
            offercat with PWD_Female
            IsOfferPwd with Y
        */ 
        if(valuesToBeInserted.length>0){
            var x= await insertManyIntoTable(con,"applicationstatus","(COAP,Offered,Accepted,OfferedRound,RetainRound,RejectOrAcceptRound,OfferCat,IsOfferPwd)",valuesToBeInserted);
        }
    } catch (error) {
        throw error;
    }
    return shortlistedCandidates;

}
//exporting these functions
module.exports={shortListPWDCandidates,shortListPWDFemaleCandidates,shortListEWSPWDCandidates}