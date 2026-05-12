const ExcelJs = require('exceljs');
const { test, expect } = require('@playwright/test');
const path = require('path');

async function writeExcelTest(searchText, replaceText, change, filePath) {
  const workbook = new ExcelJs.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet('Sheet1');

  const output = readExcel(worksheet, searchText);

  if (output.row === -1) {
    throw new Error("Search text not found");
  }

  const cell = worksheet.getCell(output.row, output.column + change.colChange);
  cell.value = replaceText;

  await workbook.xlsx.writeFile(filePath);
}

function readExcel(worksheet, searchText) {
  let output = { row: -1, column: -1 };

  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      if (cell.value?.toString() === searchText) {
        output = { row: rowNumber, column: colNumber };
      }
    });
  });

  return output;
}

test.only('Upload download excel validation', async ({ page }) => {

  const textSearch = 'Mango';
  const updateValue = '350';

  await page.goto('https://rahulshettyacademy.com/upload-download-test/index.html');

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download' }).click();

  const download = await downloadPromise;

  // ✅ Save file properly
  const filePath = path.join(__dirname, 'download.xlsx');
  await download.saveAs(filePath);

  // ✅ Update Excel
  await writeExcelTest(textSearch, updateValue, { rowChange: 0, colChange: 2 }, filePath);

  // ✅ Upload file
  await page.locator('#fileinput').setInputFiles(filePath);

  // ✅ Assertion
  const desiredRow = page.getByRole('row').filter({ has: page.getByText(textSearch) });
  await expect(desiredRow.locator('#cell-4-undefined')).toContainText(updateValue);

});