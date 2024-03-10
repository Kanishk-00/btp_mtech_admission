const tempDate = new Date();
let tempYear = tempDate.getFullYear();
const currYear = tempYear - 2000;
const prevYear = currYear - 1;
const prevprevYear = currYear - 2;
var applicantsSchema=`(
    COAP VARCHAR(200) PRIMARY KEY,
    AppNo VARCHAR(200) NOT NULL UNIQUE, 
    Email VARCHAR(500) NOT NULL UNIQUE,
    FullName text NOT NULL,
    MaxGateScore float(24) NOT NULL,
    Adm text NOT NULL,
    Pwd text NOT NULL,
    Ews text NOT NULL,
    Gender text NOT NULL,
    Category text NOT NULL,
    currYearRollNo text,
    currYearRank integer,
    currYearScore float(24),
    currYearDisc text, 
    prevYearRollNo text, 
    prevYearRank integer,
    prevYearScore float(24),
    prevYearDisc text, 
    prevprevYearRollNo text, 
    prevprevYearRank integer,
    prevprevYearScore float(24),
    prevprevYearDisc text, 
    HSSCboard text,
    HSSCdate text, 
    HSSCper float(24), 
    SSCboard text, 
    SSCdate text, 
    SSCper float(24),
    DegreeQual text, 
    DegreePassingDate text,
    DegreeBranch text,
    DegreeOtherBranch text,
    DegreeInstitute text,
    DegreeCGPA7thSem float(24),
    DegreeCGPA8thSem float(24), 
    DegreePer7thSem float(24),
    DegreePer8thSem float(24)
)
`
applicantsSchemaColumnNames=
[
    "COAP",
    "AppNo" , 
    "Email",
    "FullName",
    "MaxGateScore",
    "Adm",
    "Pwd",
    "Ews",
    "Gender",
    "Category",
    "currYearRollNo",
    "currYearRank",
    "currYearScore",
    "currYearDisc", 
    "prevYearRollNo", 
    "prevYearRank",
    "prevYearScore",
    "prevYearDisc", 
    "prevprevYearRollNo", 
    "prevprevYearRank",
    "prevprevYearScore",
    "prevprevYearDisc", 
    "HSSCboard" ,
    "HSSCdate" , 
    "HSSCper", 
    "SSCboard" , 
    "SSCdate" , 
    "SSCper" ,
    "DegreeQual" , 
    "DegreePassingDate" ,
    "DegreeBranch" ,
    "DegreeOtherBranch" ,
    "DegreeInstitute" ,
    "DegreeCGPA7thSem" ,
    "DegreeCGPA8thSem" , 
    "DegreePer7thSem" ,
    "DegreePer8thSem" 
]
module.exports={applicantsSchema,applicantsSchemaColumnNames};