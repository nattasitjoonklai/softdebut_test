import { test, expect } from '@playwright/test';
import { goto_recruitment } from './recruitment';
import fs from 'fs';
import path from 'path';
import { login_homepage } from './login';

// โหลด JSON มาเพื่อใช้ดึงข้อมูลมาทดสอบ
const searchDataPath = path.join(__dirname, '\Data-test/searchData.json');
//ตรวจสอบกรณีไม่พบไฟล์
if (!fs.existsSync(searchDataPath)) {
  throw new Error(`File not found: ${searchDataPath}`);
}
//เมื่อพบไฟล์ให้ map เข้ากับ parameter
const fileContent = fs.readFileSync(searchDataPath, 'utf-8').trim();
//แปลง json เข้ากับ parameter
var searchData = JSON.parse(fileContent);

test.beforeEach(async ({ page }) => {
  await login_homepage(page);
  await page.waitForLoadState('networkidle');
  await goto_recruitment(page);
});
test('ค้นหาผู้สมัครตามเงื่อนไข', async ({ page }) => {
  //เรียกใช้ function login_homepage
 

  // Vacancy
  await page.locator('div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-select-wrapper > .oxd-select-text').click();
  await page.getByRole('listbox').getByText(searchData.vacancy).click();

  // Status
  await page.locator('div:nth-child(4) > .oxd-input-group > div:nth-child(2) > .oxd-select-wrapper > .oxd-select-text').click();
  await page.getByRole('option', { name: searchData.status }).click();

  await page.getByRole('button', { name: 'Search' }).click();
  await page.waitForLoadState('networkidle');


  // ดึงข้อมูลจากตาราง
  const rows = page.locator('.oxd-table-body .oxd-table-row');
  const rowCount = await rows.count();
//กรณีไม่พบตาราง
  if (rowCount === 0) {
    console.log('ไม่พบข้อมูลในตาราง');
    await page.screenshot({ path: 'test-results/no-data.png' });
    return;
  }
  //ตรวจสอบจำนวนของตาราง 
  expect(rowCount).toBeGreaterThan(0);
  //วนเช็คค่าที่ได้จากตารางเพื่อตรวจจอสบกับค่าที่ได้รับมาจาก Json
  for (let i = 0; i < rowCount; i++) {
    const cells = rows.nth(i).locator('.oxd-table-cell');
    const vacancy = (await cells.nth(1).innerText()).trim();
    const status = (await cells.nth(5).innerText()).trim();
   
    expect(vacancy).toBe(searchData.vacancy);
    expect(status).toBe(searchData.status);
  }
  //แคปหน้าจอ
  await page.screenshot({ path: 'test-results/1/ค้นหาผู้สมัครตามเงื่อนไข.png' });
});

test('เพิ่มข้อมูลผู้สมัครใหม่', async ({ page }) => {
  


  // คลิกปุ่ม Add
  await page.getByRole('button', { name: /Add/ }).click();

  // เช็คว่าเข้าสู่หน้า Add Candidate แล้ว
  await expect(page).toHaveURL(/.*\/recruitment\/addCandidate/);


  // --- Full Name ---
  await page.locator('input[name="firstName"]').fill('TestFirst');
  await page.locator('input[name="middleName"]').fill('TestMiddle');
  await page.locator('input[name="lastName"]').fill('TestLast');

  // --- Vacancy ---
  await page.locator('.oxd-select-text').click();

  await page.getByRole('option', { name: 'Payroll Administrator' }).click();
  // --- Email ---
  const fakeremail = `test_data${Date.now()}@gmail.com`;
  await page.locator('input[placeholder="Type here"]').first().fill(fakeremail);
  const randomPhone = '0' + Math.floor(Math.random() * 1_000_000_000).toString().padStart(9, '0');
  console.log(randomPhone);
  // --- Contact Number ---
  await page.locator('input[placeholder="Type here"]').nth(1).fill(randomPhone);

  // --- Upload Resume ---
  try {
    const path = require('path');
    await page.locator('input[type="file"]').setInputFiles(path.join(__dirname, '../test-pdf.pdf'));
  } catch (error) {
    console.log('Resume upload skipped:', error.message);
  }

  // --- Keywords ---
  await page.locator('input[placeholder="Enter comma seperated words..."]').fill('automation, tester');

  // --- Notes ---
  await page.locator('textarea').fill('This is test candidate.');

  // SAVE
  await page.getByRole('button', { name: 'Save' }).click();


  await page.waitForLoadState('networkidle');

  // เช็ค button Reject และ Shortlist เพื่อ ยืนยันว่ามาอยู่หน้าโปรไฟล์ของ candidate แล้ว
  await expect(page.getByRole('button', { name: 'Reject' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Shortlist' })).toBeVisible();
  // ถ่าย screenshot เมื่อสำเร็จ
  await page.screenshot({ path: 'test-results/2/เพิ่มข้อมูลผู้สมัครใหม่.png' });


});
test('แก้ไขสถานะผู้สมัคร', async ({ page }) => {
 
  // Vacancy
  await page.locator('div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-select-wrapper > .oxd-select-text').click();
  await page.getByRole('listbox').getByText(searchData.vacancy).click();

  // Status
  await page.locator('div:nth-child(4) > .oxd-input-group > div:nth-child(2) > .oxd-select-wrapper > .oxd-select-text').click();
  await page.getByRole('option', { name: searchData.status }).click();


  await page.getByRole('button', { name: 'Search' }).click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // ดึงข้อมูลจากตาราง
  const rows = page.locator('.oxd-table-body .oxd-table-row');
  const rowCount = await rows.count();

  if (rowCount === 0) {
    console.log('ไม่พบข้อมูลในตาราง');
    await page.screenshot({ path: 'test-results/no-data-edit.png' });
    return;
  }

  // คลิกแถวแรก icon eye เพื่อเข้าแก้ไข
  const editButton = rows.nth(0).locator('button.oxd-icon-button').first();
  await editButton.click();
  await page.waitForLoadState('networkidle');

  

  // คลิก Shortlist button
  await page.getByRole('button', { name: 'Shortlist' }).click();
  await page.waitForLoadState('networkidle');
  
  await page.getByRole('button', { name: 'Save' }).click()
  // ยืนยัน success 
  await expect(page.locator('.oxd-toast-container')).toContainText('Success');
 
  await page.waitForLoadState('networkidle');

   //แคปรูปภาพ
  await page.waitForTimeout(5000)
  await page.screenshot({ path: 'test-results/3/แก้ไขสถานะผู้สมัคร.png' });
});

test('ตรวจสอบ Validation Errors', async ({ page }) => {
  

  // ไปหน้า Add Candidate
  await page.getByRole('link', { name: 'Candidates' }).click();
  await page.getByRole('button', { name: /Add/ }).click();
  await expect(page).toHaveURL(/.*\/recruitment\/addCandidate/);

  // คลิก Save โดยไม่ใส่ข้อมูล
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(2000);

  // เช็ค error message สำหรับ Required fields
  const firstNameInput = page.locator('input[name="firstName"]');
  const lastNameInput = page.locator('input[name="lastName"]');
  const emailInput = page.locator('input[placeholder="Type here"]').first();

  // ตรวจสอบว่ามี error class
  await expect(firstNameInput).toHaveClass(/oxd-input--error/);
  await expect(lastNameInput).toHaveClass(/oxd-input--error/);
  await expect(emailInput).toHaveClass(/oxd-input--error/);

  // เช็ค error message text
  const errorMessages = page.locator('text=Required');
  await expect(errorMessages.first()).toBeVisible();

  // ถ่าย screenshot validation error
  await page.screenshot({ path: 'test-results/4/ตรวจสอบ Validation Errors.png' });

  
});

test('ทดสอบการเรียงลำดับข้อมูล', async ({ page }) => {
 await page.waitForLoadState('networkidle');
 await page.screenshot({ path: 'test-results/5/ก่อนเรียงข้อมูล.png', fullPage: true });
  // เปิดเมนู sort ของ หัวข้อ Date of Application เพื่อใช้งาน icon sort
  const header = page.locator('.oxd-table-header-cell', { hasText: 'Date of Application' });
  //กดคลิ๊กปุ่ม icon 
  await header.locator('.oxd-table-header-sort-icon').click();
  //ตรวจสอบการแสดง Dropdown หลังจากกดเลือก icon
  await expect(header.locator('.oxd-table-header-sort-dropdown')).toBeVisible();

  // คลิก Ascending
  await header
    .locator('.oxd-table-header-sort-dropdown-item', { hasText: 'Ascending' })
    .click();

  // รอ table loader หาย
  await expect(page.locator('.oxd-table-loader')).toHaveCount(0, { timeout: 10000 });
  await page.waitForLoadState('networkidle');
  // เก็บข้อมูลแถวแรกก่อน pagination
  const rows = page.locator('.oxd-table-body .oxd-table-row');
  const rowCount = await rows.count();
  expect(rowCount).toBeGreaterThan(0);;

  const firstRowTextBeforePagination = await rows.first().innerText();

  // ตรวจ Sorting (Date ASC)
  const DATE_COLUMN_INDEX = 4;
  const date1Text = await rows.first().locator('.oxd-table-cell').nth(DATE_COLUMN_INDEX).innerText();
  const dateLastText = await rows.last().locator('.oxd-table-cell').nth(DATE_COLUMN_INDEX).innerText();

  const dateFirst = new Date(date1Text);
  const dateLast = new Date(dateLastText);

  expect(dateFirst.getTime()).not.toBeNaN(); //ตรวจสอบข้อมูล date โดยจับrow แรก และะเช็คค่าไม่ได้เป็น NAN
  expect(dateLast.getTime()).not.toBeNaN();//ตรวจสอบข้อมูล date โดยจับrow สุดท้าย และะเช็คค่าไม่ได้เป็น NAN
  expect(dateFirst.getTime()).toBeLessThanOrEqual(dateLast.getTime());  //ตรวจว่า วันแรก ≤ วันสุดท้าย ใช้เพื่อยืนยันว่า Sorting ของคอลัมน์ Date of Application ถูกต้อง (Ascending)


  // Screenshot 1
  await page.screenshot({ path: 'test-results/5/หลังเรียงข้อมูล.png', fullPage: true });

  //Pagination
  const nextBtn = page.locator('.oxd-pagination-page-item i.bi-chevron-right').first();
  await nextBtn.click();

  // รอ loader หาย
  await expect(page.locator('.oxd-table-loader')).toHaveCount(0, { timeout: 10000 });
  await page.waitForLoadState('networkidle');
  const newRows = page.locator('.oxd-table-body .oxd-table-row');
  // รอจนกว่าจะมี row อย่างน้อย 1 แถว
  const row_count = await newRows.count();
  expect(row_count).toBeGreaterThan(0);

  const firstRowTextAfterPagination = await newRows.first().innerText();

  // ตรวจว่าข้อมูลหน้าถัดไป "เปลี่ยนจริง" โดยเช็คจากข้อมูลของ row แรก
  expect(firstRowTextAfterPagination).not.toBe(firstRowTextBeforePagination);

  // Screenshot 2
  await page.screenshot({ path: 'test-results/5/เปลี่ยนหน้าข้อมูล.png', fullPage: true });
});

