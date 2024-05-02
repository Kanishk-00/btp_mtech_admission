const reader = require("xlsx");
var mysql = require("mysql2");
var applicantsSchemaColumnNames =
  require("../schemas/applicantsSchema").applicantsSchemaColumnNames;

  var excel2024ColumnNames =
  require("../schemas/excel2024ColumnNames").excel2024ColumnNames;


async function writeToExcel(
  con,
  data,
  sheetName,
  category,
  round,
  fileName,
  branch
) {
  var columnNames = "applicationstatus.offered,applicationstatus.Accepted,";
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] = await con.query(`SELECT ${columnNames} FROM mtechappl 
        LEFT JOIN applicationstatus
        ON mtechappl.COAP = applicationstatus.COAP 
        WHERE mtechappl.Category='${category}' AND mtechappl.branch = '${branch}' ORDER BY mtechappl.MaxGateScore DESC`);
    const file = reader.readFile(fileName);
    const ws = reader.utils.json_to_sheet(result);
    reader.utils.book_append_sheet(file, ws, sheetName);
    reader.writeFile(file, fileName);
  } catch (error) {
    throw error;
  }
}

async function writeToExcel2024(con, sheetName, round, fileName, branch) {
  var columnNames =
    "applicationstatus.offerCat,applicationstatus.Accepted as 'AppStatus',applicationstatus.OfferedRound as 'RoundNumber',mtechappl.branch as 'Offered Program Code',mtechappl.AppNo as 'Mtech Application Number',mtechappl.GateRegNum,";
  for (var columnName of excel2024ColumnNames) {
    columnNames += `mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] = await con.query(`SELECT ${columnNames} FROM mtechappl
        LEFT JOIN applicationstatus
        ON mtechappl.COAP = applicationstatus.COAP 
        WHERE (OfferedRound='${round}' OR Accepted='R' OR Accepted='Y') AND mtechappl.branch = '${branch}' ORDER BY applicationstatus.offerCat ASC,mtechappl.MaxGateScore DESC`);
    const file = reader.readFile(fileName);
    console.log(result);
    for (var row of result) {
      row['GateRegNum'] = row['GateRegNum'].slice(2, 14);
      row['Institute Type'] = 'IIT';
      let date = new Date().toJSON().slice(0, 10);
      row['App Date'] = date;
      if(row['Offered Program Code'].toLowerCase() === 'cse') row['Offered Program'] = 'Computer Science And Engineering';
      if(row['Offered Program Code'].toLowerCase() === 'ee') row['Offered Program'] = 'Electrical Engineering';
      if(row['Offered Program Code'].toLowerCase() === 'me') row['Offered Program'] = 'Mechanical Engineering';
    }
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
  var columnNames = "applicationstatus.offered,applicationstatus.Accepted,";
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] = await con.query(`SELECT ${columnNames} FROM mtechappl 
        LEFT JOIN applicationstatus
        ON mtechappl.COAP = applicationstatus.COAP 
        WHERE mtechappl.Category='${category}' AND Gender = "Female" AND mtechappl.branch = '${branch}' ORDER BY mtechappl.MaxGateScore DESC`);
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
  var columnNames = "applicationstatus.offered,applicationstatus.Accepted,";
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] = await con.query(`SELECT ${columnNames} FROM mtechappl 
        LEFT JOIN applicationstatus
        ON mtechappl.COAP = applicationstatus.COAP 
        WHERE EWS='Yes' AND mtechappl.branch = '${branch}' ORDER BY mtechappl.MaxGateScore DESC`);
    const file = reader.readFile(fileName);
    const ws = reader.utils.json_to_sheet(result);
    reader.utils.book_append_sheet(file, ws, sheetName);
    reader.writeFile(file, fileName);
  } catch (error) {
    throw error;
  }
}

async function writeToExcelAllOffers(con, sheetName, round, fileName, branch) {
  var columnNames =
    "applicationstatus.offerCat,mtechappl.PWD as 'IsPWD',applicationstatus.offered,applicationstatus.Accepted,applicationstatus.OfferedRound,";
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] = await con.query(`SELECT ${columnNames} FROM mtechappl
        LEFT JOIN applicationstatus
        ON mtechappl.COAP = applicationstatus.COAP 
        WHERE (OfferedRound='${round}' OR Accepted='R' OR Accepted='Y') AND mtechappl.branch = '${branch}' ORDER BY applicationstatus.offerCat ASC,mtechappl.MaxGateScore DESC`);
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
  var columnNames = "applicationstatus.offered,applicationstatus.Accepted,";
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] = await con.query(`SELECT ${columnNames} FROM mtechappl 
        LEFT JOIN applicationstatus
        ON mtechappl.COAP = applicationstatus.COAP 
        WHERE mtechappl.branch = '${branch}' ORDER BY mtechappl.MaxGateScore DESC`);
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
  var columnNames = "applicationstatus.offered,applicationstatus.Accepted,";
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] = await con.query(`SELECT ${columnNames} FROM mtechappl 
        LEFT JOIN applicationstatus
        ON mtechappl.COAP = applicationstatus.COAP 
        WHERE Gender="Female" AND mtechappl.branch = '${branch}' ORDER BY mtechappl.MaxGateScore DESC`);
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
  var columnNames = "applicationstatus.offered,applicationstatus.Accepted,";
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] = await con.query(`SELECT ${columnNames} FROM mtechappl 
        LEFT JOIN applicationstatus
        ON mtechappl.COAP = applicationstatus.COAP 
        WHERE Pwd='Yes' AND category REGEXP '${category}' AND mtechappl.branch = '${branch}' ORDER BY mtechappl.MaxGateScore DESC`);
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
  var columnNames = "applicationstatus.offered,applicationstatus.Accepted,";
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] = await con.query(`SELECT ${columnNames} FROM mtechappl 
        LEFT JOIN applicationstatus
        ON mtechappl.COAP = applicationstatus.COAP 
        WHERE Pwd='Yes' AND EWS='Yes' AND category REGEXP '${category}' AND mtechappl.branch = '${branch}' ORDER BY mtechappl.MaxGateScore DESC`);
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
  writeToExcel2024
};
