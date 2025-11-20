import { data_test } from "./Data_test";
export async function login_homepage(page ) {
  const   baseURL='https://opensource-demo.orangehrmlive.com/'
  await page.goto(baseURL) 
  await page.waitForLoadState('networkidle'); //รอจนกว่า network load state เสร็จสิ้นแล้ว ใช้ในกรณี รันเคสมาก
  await page.getByRole('textbox', { name: 'username' }).fill(data_test.username); //ดึงค่าจากไฟล์ Data_test.js กรณีไม่มีไฟล์Json
  await page.getByRole('textbox', { name: 'password' }).fill(data_test.password);
  await page.getByRole('button', { name: 'Login' }).click();
}
