const path = require('path');
const fs = require('fs');
var mysql = require('mysql2');
const userFilePath=path.join(__dirname,'..','files');
async function resetDatabase(){
    var modifiedFilePath=`${userFilePath}/modifiedFile.xlsx`;
    var uploadedFilePath=`${userFilePath}/uploadedFile.xlsx`;
    //deleting files
    if(fs.existsSync(modifiedFilePath)){
        fs.unlink(modifiedFilePath, (err) => {
            if (err) throw err;
            console.log(`${modifiedFilePath} was deleted`);
          });
    } 
    if(fs.existsSync(uploadedFilePath)){
        fs.unlink(uploadedFilePath, (err) => {
            if (err) throw err;
            console.log(`${uploadedFilePath} was deleted`);
          });
    } 
    //creating connection
    var con =mysql.createPool({
        host: process.env.MYSQL_HOSTNAME,
        user: "root",
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    }).promise();

    //droping databases
    try {
        
        const resultApplicationStatus=await con.query(`DROP TABLE IF EXISTS ${"applicationstatus"};`);
        const result=await con.query(` DROP TABLE IF EXISTS ${"mtechappl"};`);
        const resultSeatMatrix=await con.query(`DROP TABLE IF EXISTS ${"seatMatrix"};`);
    } catch (error) {
        throw error;
    }
}

module.exports={resetDatabase};