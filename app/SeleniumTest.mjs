import { Builder, By, until } from 'selenium-webdriver';

const baseUrl = 'http://testcontainer';   // Matches the network alias in the workflow
const seleniumHost = 'http://selenium:4444/wd/hub';

(async () => {
  const driver = await new Builder()
    .forBrowser('chrome')
    .usingServer(seleniumHost)
    .build();

  try {
    console.log("===== Selenium UI Test Report =====");

    const testCases = [
      {
        term: "<script>alert('xss')</script>",
        expectedError: "Invalid input detected!"
      },
      {
        term: "DROP TABLE users;",
        expectedError: "Invalid input detected!"
      },
      {
        term: "ValidSearch",
        expectedSuccess: true
      }
    ];

    for (const test of testCases) {
      await driver.get(baseUrl);

      // Find the input field
      const input = await driver.findElement(By.name('term'));
      await input.clear();
      await input.sendKeys(test.term);

      // Submit the form
      const button = await driver.findElement(By.css('button[type="submit"]'));
      await button.click();

      if (test.expectedError) {
        // Check if error message shows
        const errorElement = await driver.wait(
          until.elementLocated(By.css('p[style*="red"]')),
          3000
        );
        const errorText = await errorElement.getText();
        console.log(
          errorText.includes(test.expectedError)
            ? `✅ Passed: "${test.term}" rejected`
            : `❌ Failed: Expected error not found for "${test.term}"`
        );
      } else if (test.expectedSuccess) {
        // Check if we landed on success page
        const successHeader = await driver.wait(
          until.elementLocated(By.css('h1')),
          3000
        );
        const text = await successHeader.getText();
        console.log(
          text === 'Search Term'
            ? `✅ Passed: "${test.term}" accepted`
            : `❌ Failed: Expected success page for "${test.term}"`
        );
      }
    }
  } catch (err) {
    console.error('🚨 Selenium test failed:', err);
  } finally {
    await driver.quit();
  }
})();
