const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../SAMPLETRACER.xlsx');
const workbook = XLSX.readFile(filePath);
const firstSheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[firstSheetName];
const jsonData = XLSX.utils.sheet_to_json(worksheet);

console.log(JSON.stringify(jsonData, null, 2));
