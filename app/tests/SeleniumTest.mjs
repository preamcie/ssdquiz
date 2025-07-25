import { Builder, By, until } from 'selenium-webdriver';

const baseUrl = 'http://localhost:3000';

(async () => {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    const testCases = [
      {
        term: "<script>alert('xss')</script>",
        expectedError: "Invalid input detected!"
      },
      {
        term: "drop table users;",
        expectedError: "Invalid input detected!"
      },
      {
        term: "validSearch",
        expectedSuccess: true
      }
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
        if (errorText.includes(test.expectedError)) {
          console.log(`✅ Passed: "${test.term}" rejected correctly.`);
        } else {
          console.error(`❌ Error mismatch: ${errorText}`);
        }
      } else if (test.expectedSuccess) {
        const successHeader = await driver.wait(
          until.elementLocated(By.css('h1')),
          3000
        );
        const text = await successHeader.getText();
        if (text === 'Search Term') {
          console.log(`✅ Success test passed for: "${test.term}"`);
        } else {
          console.error(`❌ Expected search term page not found.`);
        }
      }
    }
  } catch (err) {
    console.error('🚨 Selenium test failed:', err);
  } finally {
    await driver.quit();
  }
})();
console.log("===== Selenium UI Test Report =====");