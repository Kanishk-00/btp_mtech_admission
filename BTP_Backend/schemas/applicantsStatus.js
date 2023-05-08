var applicantsStatusSchema=`(
    COAP VARCHAR(200) NOT NULL UNIQUE,
    Offered text,
    Accepted text,        
    OfferCat text,
    IsOfferPwd text,
    OfferedRound text,
    RetainRound text,
    RejectOrAcceptRound text,
    ManualUpdate text,
    FOREIGN KEY (COAP)  REFERENCES mtechappl (COAP)
    )
`;
module.exports={applicantsStatusSchema};