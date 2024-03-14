const applicantsStatusSchema = (branch) => `
    (
        COAP VARCHAR(200) NOT NULL UNIQUE,
        Offered text,
        Accepted text,        
        OfferCat text,
        IsOfferPwd text,
        OfferedRound text,
        RetainRound text,
        RejectOrAcceptRound text,
        ManualUpdate text,
        FOREIGN KEY (COAP)  REFERENCES ${branch}_mtechappl (COAP)
    )
`;

module.exports = { applicantsStatusSchema };
