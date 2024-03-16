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
  var columnNames = `applicationstatus.offered,applicationstatus.Accepted,`;
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `mtechappl.${columnName},`;
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] = await con.query(`SELECT ${columnNames} FROM mtechappl 
  LEFT JOIN applicationstatus
  ON mtechappl.COAP = applicationstatus.COAP 
  WHERE mtechappl.Category='${category}' AND mtechappl.branch='${branch}' ORDER BY mtechappl.MaxGateScore DESC`);
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
  var columnNames = `applicationstatus.offered,applicationstatus.Accepted,`;
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] = await con.query(`SELECT ${columnNames} FROM mtechappl 
  LEFT JOIN applicationstatus
  ON mtechappl.COAP = applicationstatus.COAP 
  WHERE mtechappl.Category='${category}' AND mtechappl.Gender = "Female" AND mtechappl.branch='${branch}' ORDER BY mtechappl.MaxGateScore DESC`);
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
  var columnNames = `applicationstatus.offered,applicationstatus.Accepted,`;
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] = await con.query(`SELECT ${columnNames} FROM mtechappl 
  LEFT JOIN applicationstatus
  ON mtechappl.COAP = applicationstatus.COAP 
  WHERE mtechappl.EWS='Yes' AND mtechappl.branch='${branch}' ORDER BY mtechappl.MaxGateScore DESC`);
    const file = reader.readFile(fileName);
    const ws = reader.utils.json_to_sheet(result);
    reader.utils.book_append_sheet(file, ws, sheetName);
    reader.writeFile(file, fileName);
  } catch (error) {
    throw error;
  }
}

async function writeToExcelAllOffers(con, sheetName, round, fileName, branch) {
  var columnNames = `applicationstatus.offerCat, mtechappl.PWD as 'IsPWD', applicationstatus.offered, applicationstatus.Accepted,`;
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] = await con.query(`SELECT ${columnNames} FROM mtechappl
  LEFT JOIN applicationstatus
  ON mtechappl.COAP = applicationstatus.COAP 
  WHERE (OfferedRound='${round}' OR Accepted='R' OR Accepted='Y') AND mtechappl.branch='${branch}' ORDER BY applicationstatus.offerCat ASC, mtechappl.MaxGateScore DESC`);

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
  var columnNames = `applicationstatus.offered,applicationstatus.Accepted,`;
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] = await con.query(`SELECT ${columnNames} FROM mtechappl
  LEFT JOIN applicationstatus
  ON mtechappl.COAP = applicationstatus.COAP 
  WHERE mtechappl.branch='${branch}' ORDER BY mtechappl.MaxGateScore DESC`);
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
  var columnNames = `applicationStatus.offered,applicationStatus.Accepted,`;
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] = await con.query(`SELECT ${columnNames} FROM mtechappl 
  LEFT JOIN applicationstatus 
  ON mtechappl.COAP = applicationstatus.COAP 
  WHERE mtechappl.branch='${branch}' AND mtechappl.Gender="Female" ORDER BY mtechappl.MaxGateScore DESC`);
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
  var columnNames = `applicationstatus.offered,applicationstatus.Accepted,`;
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] = await con.query(`SELECT ${columnNames} FROM mtechappl 
  LEFT JOIN applicationstatus 
  ON mtechappl.COAP = applicationstatus.COAP 
  WHERE mtechappl.branch='${branch}' AND  
  mtechappl.Pwd='Yes' AND mtechappl.category REGEXP '${category}' ORDER BY mtechappl.MaxGateScore DESC`);
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
  var columnNames = `applicationstatus.offered,applicationstatus.Accepted,`;
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] = await con.query(`SELECT ${columnNames} FROM mtechappl 
  LEFT JOIN applicationstatus 
  ON mtechappl.COAP = applicationstatus.COAP 
  WHERE mtechappl.branch='${branch}' AND  
  mtechappl.Pwd='Yes' AND mtechappl.EWS='Yes' AND mtechappl.category REGEXP '${category}' ORDER BY mtechappl.MaxGateScore DESC`);
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
