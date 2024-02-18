const router = require("express").Router();
var { selectQuery } = require("../utils/sqlqueries");
var mysql = require("mysql2");
const isAuthenticated = require("../middleware/authMiddleware");

router.get("/getCoapIds", isAuthenticated, async (req, res) => {
  var con;
  try {
    con = mysql
      .createPool({
        host: process.env.MYSQL_HOSTNAME,
        user: "root",
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
      })
      .promise();
  } catch (error) {
    console.log(error);
    res.status(500).send({ result: "Error creating database connection" });
    return;
  }
  try {
    const [coapIdsList] = await con.query(
      `SELECT COAP as label from mtechappl `
    );
    res.status(200).send({ result: coapIdsList });
  } catch (error) {
    console.log(error);
    res.status(500).send({ result: "NO Table Exists" });
  }
});

router.post("/getinfo", isAuthenticated, async (req, res) => {
  var con;
  try {
    con = mysql
      .createPool({
        host: process.env.MYSQL_HOSTNAME,
        user: "root",
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
      })
      .promise();
  } catch (error) {
    console.log(error);
    res.status(500).send({ result: "Error creating database connection" });
    return;
  }
  // console.log(req.body);
  var category = null;
  var gender = null;
  var coapId = null;
  if (req.body.category != null) category = req.body.category.label;
  if (req.body.gender != null) gender = req.body.gender.label;
  if (req.body.coapId != null) coapId = req.body.coapId.label;

  try {
    const [filteredList] =
      await con.query(`SELECT COAP as coap,gender as gender,Category as category,
        maxgatescore as maxgatescore,ews as ews,pwd as pwd,AppNo as appno
        from mtechappl where
       category REGEXP ${
         category === null || category === "" ? `'\w*'` : `'${category}'`
       } 
       and COAP REGEXP ${
         coapId === null || coapId === "" ? `'\w*'` : `'${coapId}'`
       } 
       and gender REGEXP ${
         gender === null || gender === "" ? `'\w*'` : `'${gender}'`
       } order by maxGateScore DESC limit 50; `);
    res.status(200).send({ result: filteredList });
  } catch (error) {
    console.log(error);
    res.status(500).send({ result: "Internal Server Error" });
  }
});

router.get("/getinfo/:coapid", async (req, res) => {
  var con = mysql
    .createPool({
      host: process.env.MYSQL_HOSTNAME,
      user: "root",
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    })
    .promise();

  var coapid = req.params.coapid;

  try {
    const [filteredList] =
      await con.query(`select FullName,AppNo as ApplicationNumber,mtechappl.COAP,Email,MaxGateScore,Gender, Category,
        EWS,PWD,Adm,SSCper,HSSCper,DegreeCGPA8thSem,
        Offered,
        Accepted,        
        OfferCat,
        IsOfferPwd,
        OfferedRound,
        RetainRound,
        RejectOrAcceptRound
        from mtechappl        
        left join applicationstatus
        on mtechappl.COAP = applicationstatus.COAP where mtechappl.COAP ='${coapid}'; `);
    res.status(200).send({ result: filteredList });
  } catch (error) {
    console.log(error);
    res.status(500).send({ result: "Internal Server Error" });
  }
});
module.exports = router;
