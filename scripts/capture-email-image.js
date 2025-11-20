const path = require('path');
const { chromium } = require('playwright-chromium');

(async () => {
  const htmlPath = path.join(__dirname, '..', 'email-sponsor-invite.html');
  const fileUrl = 'file://' + htmlPath;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 720, height: 2000 } });
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const outPath = path.join(__dirname, '..', 'assets', 'images', 'email-invite-flat.jpg');
  await page.screenshot({ path: outPath, fullPage: true, type: 'jpeg', quality: 85 });
  await browser.close();
  console.log('Saved screenshot to', outPath);
})();
