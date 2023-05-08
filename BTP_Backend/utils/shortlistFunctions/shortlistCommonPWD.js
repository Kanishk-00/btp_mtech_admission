var query=require("../sqlqueries").selectQuery;
const { insertManyIntoTable } = require("../sqlqueries");
const {findAvailableSeats}=require("../findAvailableSeats");

async function updateCandidateStatus(con,candidate,offerCat,round){
    //updating the shortlisted candidates status in the applicationstatus table.
    try {
        let valuesToBeInserted=[]        
        valuesToBeInserted.push([candidate.COAP,'Y','',round,'','',offerCat,'Y']);
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
            console.log(`seat offered to ${candidate.COAP} in ${offerCat} category (COMMON_PWD)`);
        }
    } catch (error) {
        throw error;
    }
}
/*
    Name: shortlistCommonPWDCandidates
    Input : connection object to the database,limit on how many members to shortlist,ongoing round
    output: JSON object containing all the shortlisted candidates.
    Functionality : shortlists limit no of EWS candidates based on their max gatescore. 
*/
async function shortlistCommonPWDCandidates(con,limit,round ){
    //query that is being made to database.
    var checkedCandidatesCoapID=['x'];
    //variable to store shortlisted candidates
    while(limit>0){
        var checkedCOAPIDs="";
        for (const element of checkedCandidatesCoapID) {
            checkedCOAPIDs+=`'${element}',`
        }
        if(checkedCOAPIDs.length>0){
            checkedCOAPIDs=checkedCOAPIDs.slice(0,-1);
        }
        queryString=`select mtechappl.COAP, Gender, Category, MaxGateScore,EWS,PWD
        Offered, 
        Accepted,
        OfferedRound
        from mtechappl
        left join applicationstatus
        on mtechappl.COAP = applicationstatus.COAP 
        where Offered is null and Pwd='Yes' and mtechappl.COAP not in (${checkedCOAPIDs})
        order by MaxGateScore desc,HSSCper desc,SSCper desc
        Limit 1 `
        var shortlistedCandidates;
        //querying
        try {
            var [shortlistedCandidates]=await con.query(queryString);
            shortlistedCandidates=shortlistedCandidates[0]
            // console.log("Common PWD",shortlistedCandidates);
            if(!shortlistedCandidates){
                break;
            }
            var cat=shortlistedCandidates['Category'];
            if(cat==='GEN' && shortlistedCandidates.EWS=='Yes' ){
                var seats=await findAvailableSeats(con,"EWS_FandM",round);
                if(seats>0){
                    try {
                        var res=await updateCandidateStatus(con,shortlistedCandidates,'EWS_FandM_PWD',round);
                    } catch (error) {
                        throw error;
                    }
                    limit-=1;
                    // console.log("limit",limit);
                }
            }
            else if(cat==='GEN'){
                var seats=await findAvailableSeats(con,"GEN_FandM",round);
                if(seats>0){
                    try {
                        var res=await updateCandidateStatus(con,shortlistedCandidates,'GEN_FandM_PWD',round);
                    } catch (error) {
                        throw error;
                    }
                    limit-=1;
                }
            }
            else if(cat==='OBC'){
                var seats=await findAvailableSeats(con,"OBC_FandM",round);
                if(seats>0){
                    try {
                        var res=await updateCandidateStatus(con,shortlistedCandidates,'OBC_FandM_PWD',round);
                    } catch (error) {
                        throw error;
                    }
                    limit-=1;
                }
            }
            else if(cat==='SC'){
                var seats=await findAvailableSeats(con,"SC_FandM",round);
                if(seats>0){
                    try {
                        var res=await updateCandidateStatus(con,shortlistedCandidates,'SC_FandM_PWD',round);
                    } catch (error) {
                        throw error;
                    }
                    
                    limit-=1;
                }
            }
            else if(cat==='ST'){
                var seats=await findAvailableSeats(con,"ST_FandM",round,round);
                if(seats>0){
                    try {
                        var res=await updateCandidateStatus(con,shortlistedCandidates,'ST_FandM_PWD',round);
                    } catch (error) {
                        throw error;
                    }
                    limit-=1;
                }
            }
            checkedCandidatesCoapID.push(shortlistedCandidates['COAP']);
        } catch (error) {
            throw error;
        }
    }
    return shortlistedCandidates;
}

module.exports={shortlistCommonPWDCandidates}