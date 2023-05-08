var query=require("../sqlqueries").selectQuery;
const { insertManyIntoTable } = require("../sqlqueries");
/*
    Name: shortListReservedCandidates
    Input : connection object to the database,limit on how many members to shortlist in a category,gender,category(OBC,SC,ST),ongoing round
    output: JSON object containing all the shortlisted candidates.
    Functionality : shortlists limit no of category(OBC,SC,ST) based on input candidates based on their max gatescore. 
*/
async function shortListReservedCandidates(con,limit,gender,category,round){
    let queryString;
    let currCategory=category;
    //variable to store the current cuategory
    if(gender=='F'){
        //if gender is female this will be the query string
        queryString=`select mtechappl.COAP, Gender, Category, MaxGateScore,
        Offered, 
        Accepted,
        OfferedRound
        from mtechappl
        left join applicationstatus
        on mtechappl.COAP = applicationstatus.COAP 
        where Offered is null and Gender = "Female" and Category="${category}"
        order by MaxGateScore desc,HSSCper desc,SSCper desc
        Limit ${limit}`
        currCategory=currCategory+"_Female";

    }
    else{
        //if gender is female this will be the query string
        queryString=`select mtechappl.COAP, Gender, Category, MaxGateScore,
        Offered, 
        Accepted,
        OfferedRound
        from mtechappl
        left join applicationstatus
        on mtechappl.COAP = applicationstatus.COAP 
        where Offered is null and Category="${category}"
        order by MaxGateScore desc,HSSCper desc,SSCper desc
        Limit ${limit}`
        currCategory=currCategory+"_FandM";
    }
    //variable to store shortlisted candidates.
    var shortlistedCandidates;
    try {
        var [shortlistedCandidates]=await con.query(queryString);
        // console.log(shortlistedCandidates);
    } catch (error) {
        throw error;
    }
    try {
        // console.log(currCategory)
        let valuesToBeInserted=[]        
        for (const candidate of shortlistedCandidates) {
          valuesToBeInserted.push([candidate.COAP,'Y','',round,'','',currCategory]);
          console.log(`shortlisted ${candidate.COAP} in ${currCategory} category `);
        }
        /*
            updating 
            COAP with shortlisted candidate coap
            offered with 'Y'
            OfferedRound with current round number
            offercat with currCategory(variable)
        */ 
        if(valuesToBeInserted.length>0){
            var x= await insertManyIntoTable(con,"applicationstatus","(COAP,Offered,Accepted,OfferedRound,RetainRound,RejectOrAcceptRound,OfferCat)",valuesToBeInserted);

        }
    } catch (error) {
        throw error;
    }
    //exporting shortlisted functions
    return shortlistedCandidates;

}
//exporting these functions
module.exports={shortListReservedCandidates}