var roundsSchema = `(
    COAP VARCHAR(200) NOT NULL UNIQUE, 
    Offered text, 
    Accepted text, 
    OfferCat text, 
    IsOfferPwd text, 
    OfferedRound text, 
    RetainRound text, 
    RejectOrAcceptRound text, 
    ManualUpdate text, 
    branch VARCHAR(255)
)`;

module.exports = { roundsSchema };
