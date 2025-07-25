import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const baseUrl = 'http://localhost:3000';

(async () => {
  // Chrome options for GitHub Actions runner
  const options = new chrome.Options()
    .addArguments('--headless')
    .addArguments('--no-sandbox')
    .addArguments('--disable-dev-shm-usage')
    .addArguments(`--user-data-dir=/tmp/chrome-profile-${Date.now()}`);

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    console.log("===== Selenium UI Test Report =====");
    const testCases = [
      { term: "<script>alert('xss')</script>", expectedError: "Invalid input detected!" },
      { term: "drop table users;", expectedError: "Invalid input detected!" },
      { term: "validSearch", expectedSuccess: true }
    ];

    for (const test of testCases) {
      await driver.get(baseUrl);

      const input = await driver.findElement(By.name('term'));
      await input.clear();
      await input.sendKeys(test.term);

      const button = await driver.findElement(By.css('button[type="submit"]'));
      await button.click();

      if (test.expectedError) {
        const errorElement = await driver.wait(
          until.elementLocated(By.css('p[style*="red"]')),
          3000
        );
        const errorText = await errorElement.getText();
        console.log(
          errorText.includes(test.expectedError)
            ? `✅ Passed: "${test.term}" rejected`
            : `❌ Mismatch: ${errorText}`
        );
      } else if (test.expectedSuccess) {
        const successHeader = await driver.wait(
          until.elementLocated(By.css('h1')),
          3000
        );
        const text = await successHeader.getText();
        console.log(
          text === 'Search Term'
            ? `✅ Passed: "${test.term}" accepted`
            : '❌ Expected search result page not found'
        );
      }
    }
  } catch (err) {
    console.error('🚨 Selenium test failed:', err);
  } finally {
    await driver.quit();
  }
})();
