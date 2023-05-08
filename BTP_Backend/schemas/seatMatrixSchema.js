var seatMatrixSchema=`(
    Category     varchar(200) NOT NULL UNIQUE,
    SeatsAllocated integer
    )
`
// n_ST_FandM   integer,
// n_ST_Female  integer,
// n_SC_FandM   integer,
// n_SC_Female  integer,
// n_OBC_FandM  integer,
// n_OBC_Female integer,
// n_EWS_FandM   integer,
// n_EWS_Female   integer,
// n_GEN_FandM  integer,
// n_GEN_Female  integer,
// n_PWD_FandM  integer,
// n_PWD_Female  integer,
module.exports={seatMatrixSchema}