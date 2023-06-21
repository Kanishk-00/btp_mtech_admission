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
    //The query is modified to accomadate the change where a GEN_Female category can no longer be upgraded to GEN_FandM
    queryString=`select mtechappl.COAP, Gender, Category, MaxGateScore,
    Offered, 
    Accepted,
    OfferCat,
    OfferedRound
    from mtechappl
    left join applicationstatus
    on mtechappl.COAP = applicationstatus.COAP 
    where Offered is null or (Accepted='R' and OfferCat !='GEN_Female') or (Accepted='Y' and OfferCat !='GEN_Female')
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
    /*
        Possible category updates:- 
        
        OBC_FandM         ->   Gen_FandM
        SC_FandM          ->   Gen_FandM
        ST_FandM          ->   Gen_FandM

        Note:- ** for the below updation to happen there should be no female seats in the candidate category as well as 
        there should be no female seats availabele in general category. ** 
        OBC_Female         ->   Gen_FandM
        SC_Female          ->   Gen_FandM
        ST_Female          ->   Gen_FandM
    */
    try {
        let valuesToBeInserted=[]        
        for (const candidate of shortlistedCandidates) {
            //category upgradtion
            if(candidate['Accepted'] && candidate['Accepted']=='R'){
                //making sure no female candidadate is upgraded to GEN_FandM
                if(candidate['OfferCat']!='GEN_FandM' && candidate['OfferCat']!='GEN_Female'){
                    const [updateResult]=await con.query(`UPDATE applicationstatus
                    SET  OfferedRound=${round},OfferCat="GEN_FandM"
                    WHERE COAP = '${candidate.COAP}';`); 
                }
            }
            //category upgradtion
            else if(candidate['Accepted'] && candidate['Accepted']=='Y'){
                //making sure no female candidadate is upgraded to GEN_FandM
                if(candidate['OfferCat']!='GEN_FandM' && candidate['OfferCat']!='GEN_Female'){
                    const [updateResult]=await con.query(`UPDATE applicationstatus
                    SET  OfferedRound=${round},OfferCat="GEN_FandM"
                    WHERE COAP = '${candidate.COAP}';`); 
                }
            }
            //Normal allocation
            else{
                valuesToBeInserted.push([candidate.COAP,'Y','',round,'','',"GEN_FandM"]);
                console.log(`shortlisted ${candidate.COAP} in GEN_FandM category `);
            }

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
    OfferCat,
    OfferedRound
    from mtechappl
    left join applicationstatus
    on mtechappl.COAP = applicationstatus.COAP 
    where (Offered is null or Accepted='R' or Accepted='Y') and Gender = "Female"
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
    /*
        OBC_Female         ->   Gen_Female
        SC_Female          ->   Gen_Female
        ST_Female          ->   Gen_Female
    */
    try {
        let valuesToBeInserted=[]        
        for (const candidate of shortlistedCandidates) {
            //category upgradation
            if(candidate['Accepted'] && candidate['Accepted']=='R'){
                if(candidate['OfferCat']!='GEN_Female'){
                    const [updateResult]=await con.query(`UPDATE applicationstatus
                    SET  OfferedRound=${round},OfferCat="GEN_Female"
                    WHERE COAP = '${candidate.COAP}';`); 
                }

            }
            //category upgradation
            else if(candidate['Accepted'] && candidate['Accepted']=='Y'){
                if(candidate['OfferCat']!='GEN_Female'){
                    const [updateResult]=await con.query(`UPDATE applicationstatus
                    SET  OfferedRound=${round},OfferCat="GEN_Female"
                    WHERE COAP = '${candidate.COAP}';`); 
                }

            }
            //normal allocation
            else{
                valuesToBeInserted.push([candidate.COAP,'Y','',round,'','',"GEN_Female"]);
                console.log(`shortlisted ${candidate.COAP} in GEN_Female category `);
            }
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