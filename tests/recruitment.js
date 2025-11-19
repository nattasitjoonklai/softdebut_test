export async function goto_recruitment (page){
  await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: 'Recruitment' }).click();
  await page.getByRole('link', { name: 'Candidates' }).click();

}