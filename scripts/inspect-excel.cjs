const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../SAMPLETRACER.xlsx');
const workbook = XLSX.readFile(filePath);
const firstSheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[firstSheetName];
const jsonData = XLSX.utils.sheet_to_json(worksheet);

console.log('Sheet Name:', firstSheetName);
console.log('Total Rows:', jsonData.length);
if (jsonData.length > 0) {
  console.log('Columns in first row:', Object.keys(jsonData[0]));
  console.log('First row data:', jsonData[0]);
} else {
  console.log('No rows found.');
}
