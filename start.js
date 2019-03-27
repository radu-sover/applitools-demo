var webdriver = require("selenium-webdriver");

var Capabilities = webdriver.Capabilities;
var Builder = webdriver.Builder;
var By = webdriver.By;

var SeleniumSDK = require("eyes.selenium");
var Eyes = SeleniumSDK.Eyes;

// Initialize the eyes SDK and set your private API key.
var eyes = new Eyes();

eyes.setApiKey(process.env.APPLITOOLS_API_KEY);


if (!process.env.APPLITOOLS_API_KEY) {
    console.log(`
     ⚠️️️  Please set the APPLITOOLS_API_KEY environment variable

        * On Mac: export APPLITOOLS_API_KEY='YOUR_API_KEY'

        * On windows: set APPLITOOLS_API_KEY='YOUR_API_KEY'

        * Please Note: You can get your API key by logging into applitools.com | Click on the person icon (top-right corner) | Click on the "My API key" menu
    `);
    process.exit(0);
}

var driver = new Builder().withCapabilities(Capabilities.chrome()).build();
driver.manage().window().setSize(1200, 800);

async function main() {
    try {
        await eyes.open(driver, 'app name', 'test name');

        await driver.get('http://nationalgeographic.org/components/');
        await driver.findElement(By.id("id_password")).sendKeys("1888");
        await driver.findElement(By.className('ng-button ng-button-primary ng-button-large ng-align-center')).click();

        const elementClassName = '.ng-hero-carousel';

        const element = driver.findElement(By.css(elementClassName));
        await driver.executeScript("arguments[0].scrollIntoView(true)", element);

        for(let i=0; i <= 2; i++) {
            const slideSelector = `li[data-ng-slideshow-item='${i}']`;
            await driver.findElement(By.css(slideSelector)).click();
            await eyes.checkRegion(By.css(elementClassName),  `test`, 2000);
        }

        await eyes.close(false);

    } finally {
        // Close the browser.
        await driver.quit();

        // If the test was aborted before eyes.close was called ends the test as aborted.
        await eyes.abortIfNotClosed();
    }
}


main();
