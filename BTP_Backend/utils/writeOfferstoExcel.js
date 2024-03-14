const reader = require("xlsx");
const mysql = require("mysql2");

var applicantsSchemaColumnNames =
  require("../schemas/applicantsSchema").applicantsSchemaColumnNames;

async function writeToExcel(
  con,
  data,
  sheetName,
  category,
  round,
  fileName,
  branch
) {
  var columnNames = `${branch}_applicationstatus.offered,${branch}_applicationstatus.Accepted,`;
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `${branch}_mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] =
      await con.query(`SELECT ${columnNames} FROM ${branch}_mtechappl 
        LEFT JOIN ${branch}_applicationstatus
        ON ${branch}_mtechappl.COAP = ${branch}_applicationstatus.COAP 
        WHERE ${branch}_mtechappl.Category='${category}' ORDER BY ${branch}_mtechappl.MaxGateScore DESC`);
    const file = reader.readFile(fileName);
    const ws = reader.utils.json_to_sheet(result);
    reader.utils.book_append_sheet(file, ws, sheetName);
    reader.writeFile(file, fileName);
  } catch (error) {
    throw error;
  }
}

async function writeToExcelFemaleCandidates(
  con,
  data,
  sheetName,
  category,
  round,
  fileName,
  branch
) {
  var columnNames = `${branch}_applicationstatus.offered,${branch}_applicationstatus.Accepted,`;
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `${branch}_mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] =
      await con.query(`SELECT ${columnNames} FROM ${branch}_mtechappl 
        LEFT JOIN ${branch}_applicationstatus
        ON ${branch}_mtechappl.COAP = ${branch}_applicationstatus.COAP 
        WHERE ${branch}_mtechappl.Category='${category}' AND ${branch}_mtechappl.Gender = "Female" ORDER BY ${branch}_mtechappl.MaxGateScore DESC`);
    const file = reader.readFile(fileName);
    const ws = reader.utils.json_to_sheet(result);
    reader.utils.book_append_sheet(file, ws, sheetName);
    reader.writeFile(file, fileName);
  } catch (error) {
    throw error;
  }
}

async function writeToExcelEWS(
  con,
  data,
  sheetName,
  category,
  round,
  fileName,
  branch
) {
  var columnNames = `${branch}_applicationstatus.offered,${branch}_applicationstatus.Accepted,`;
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `${branch}_mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] =
      await con.query(`SELECT ${columnNames} FROM ${branch}_mtechappl 
                LEFT JOIN ${branch}_applicationstatus
                ON ${branch}_mtechappl.COAP = ${branch}_applicationstatus.COAP 
                WHERE ${branch}_mtechappl.EWS='Yes' ORDER BY ${branch}_mtechappl.MaxGateScore DESC`);
    const file = reader.readFile(fileName);
    const ws = reader.utils.json_to_sheet(result);
    reader.utils.book_append_sheet(file, ws, sheetName);
    reader.writeFile(file, fileName);
  } catch (error) {
    throw error;
  }
}

async function writeToExcelAllOffers(con, sheetName, round, fileName, branch) {
  var columnNames = `${branch}_applicationstatus.offerCat, ${branch}_mtechappl.PWD as 'IsPWD', ${branch}_applicationstatus.offered, ${branch}_applicationstatus.Accepted,`;
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `${branch}_mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] =
      await con.query(`SELECT ${columnNames} FROM ${branch}_mtechappl
                LEFT JOIN ${branch}_applicationStatus
                ON ${branch}_mtechappl.COAP = ${branch}_applicationStatus.COAP 
                WHERE (OfferedRound='${round}' OR Accepted='R' OR Accepted='Y') ORDER BY ${branch}_applicationStatus.offerCat ASC, ${branch}_mtechappl.MaxGateScore DESC`);

    console.log("Write to excel all offers ke andar hun.....\n\n\n");
    const file = reader.readFile(fileName);
    const ws = reader.utils.json_to_sheet(result);
    reader.utils.book_append_sheet(file, ws, sheetName);
    reader.writeFile(file, fileName);
    deleteWorksheet(fileName, "Sheet1");
  } catch (error) {
    throw error;
  }
}

async function writeToExcelGeneral(
  con,
  data,
  sheetName,
  category,
  round,
  fileName,
  branch
) {
  var columnNames = `${branch}_applicationstatus.offered,${branch}_applicationstatus.Accepted,`;
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `${branch}_mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] =
      await con.query(`SELECT ${columnNames} FROM ${branch}_mtechappl 
        LEFT JOIN ${branch}_applicationstatus
        ON ${branch}_mtechappl.COAP = ${branch}_applicationstatus.COAP 
        ORDER BY ${branch}_mtechappl.MaxGateScore DESC`);
    const file = reader.readFile(fileName);
    const ws = reader.utils.json_to_sheet(result);
    reader.utils.book_append_sheet(file, ws, sheetName);
    reader.writeFile(file, fileName);
  } catch (error) {
    throw error;
  }
}

async function writeToExcelGeneralFemale(
  con,
  data,
  sheetName,
  category,
  round,
  fileName,
  branch
) {
  var columnNames = `${branch}_applicationStatus.offered,${branch}_applicationStatus.Accepted,`;
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `${branch}_mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] =
      await con.query(`SELECT ${columnNames} FROM ${branch}_mtechappl 
        LEFT JOIN ${branch}_applicationstatus
        ON ${branch}_mtechappl.COAP = ${branch}_applicationstatus.COAP 
        WHERE ${branch}_mtechappl.Gender="Female" ORDER BY ${branch}_mtechappl.MaxGateScore DESC`);
    const file = reader.readFile(fileName);
    const ws = reader.utils.json_to_sheet(result);
    reader.utils.book_append_sheet(file, ws, sheetName);
    reader.writeFile(file, fileName);
  } catch (error) {
    throw error;
  }
}

async function writeToExcelPWD(
  con,
  data,
  sheetName,
  category,
  round,
  fileName,
  branch
) {
  var columnNames = `${branch}_applicationstatus.offered,${branch}_applicationstatus.Accepted,`;
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `${branch}_mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] =
      await con.query(`SELECT ${columnNames} FROM ${branch}_mtechappl 
        LEFT JOIN ${branch}_applicationstatus
        ON ${branch}_mtechappl.COAP = ${branch}_applicationstatus.COAP WHERE  
        ${branch}_mtechappl.Pwd='Yes' AND ${branch}_mtechappl.category REGEXP '${category}' ORDER BY ${branch}_mtechappl.MaxGateScore DESC`);
    const file = reader.readFile(fileName);
    const ws = reader.utils.json_to_sheet(result);
    reader.utils.book_append_sheet(file, ws, sheetName);
    reader.writeFile(file, fileName);
  } catch (error) {
    throw error;
  }
}

async function writeToExcelEWSPWD(
  con,
  data,
  sheetName,
  category,
  round,
  fileName,
  branch
) {
  var columnNames = `${branch}_applicationstatus.offered,${branch}_applicationstatus.Accepted,`;
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `${branch}_mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] =
      await con.query(`SELECT ${columnNames} FROM ${branch}_mtechappl 
        LEFT JOIN ${branch}_applicationstatus
        ON ${branch}_mtechappl.COAP = ${branch}_applicationstatus.COAP WHERE  
        ${branch}_mtechappl.Pwd='Yes' AND ${branch}_mtechappl.EWS='Yes' AND ${branch}_mtechappl.category REGEXP '${category}' ORDER BY ${branch}_mtechappl.MaxGateScore DESC`);
    const file = reader.readFile(fileName);
    const ws = reader.utils.json_to_sheet(result);
    reader.utils.book_append_sheet(file, ws, sheetName);
    reader.writeFile(file, fileName);
  } catch (error) {
    throw error;
  }
}

const deleteWorksheet = async (filePath, workSheetName) => {
  const workBook = reader.readFile(filePath);
  const workSheetNames = Object.keys(workBook.Sheets);
  console.log(workSheetNames);
  if (workSheetNames.includes(workSheetName)) {
    delete workBook.Sheets[workSheetName];
    delete workBook.SheetNames[workSheetName];
    indexToDelete = workBook.SheetNames.indexOf(workSheetName);
    workBook.SheetNames.splice(indexToDelete, 1);
    reader.writeFile(workBook, filePath);
  }
};

module.exports = {
  writeToExcel,
  writeToExcelAllOffers,
  writeToExcelEWS,
  writeToExcelGeneral,
  writeToExcelGeneralFemale,
  writeToExcelFemaleCandidates,
  writeToExcelPWD,
  deleteWorksheet,
  writeToExcelEWSPWD,
};
