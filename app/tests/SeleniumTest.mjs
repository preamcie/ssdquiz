import { Builder, By, until } from 'selenium-webdriver';

const baseUrl = 'http://testcontainer';
const seleniumHost = 'http://selenium:4444/wd/hub';

(async () => {
  const driver = await new Builder()
    .forBrowser('chrome')
    .usingServer(seleniumHost)
    .build();

  try {
    console.log("===== Selenium UI Test Report =====");
    // Your original test cases here (unchanged)
  } catch (err) {
    console.error('🚨 Selenium test failed:', err);
  } finally {
    await driver.quit();
  }
})();
