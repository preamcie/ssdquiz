import { Builder, By, until } from 'selenium-webdriver';

const baseUrl = 'http://testcontainer';   // 👈 matches the workflow network alias
const seleniumHost = 'http://selenium:4444/wd/hub';

(async () => {
  const driver = await new Builder()
    .forBrowser('chrome')
    .usingServer(seleniumHost)
    .build();

  try {
    console.log("===== Selenium UI Test Report =====");
    // same tests you already wrote...
  } catch (err) {
    console.error('🚨 Selenium test failed:', err);
  } finally {
    await driver.quit();
  }
})();
