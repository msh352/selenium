import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { config } from './config.js';

let driver;

export async function createDriver() {
  if (driver) return driver;

  if (config.browser !== 'chrome') {
    throw new Error('For simplicity, this project currently supports only Chrome.');
  }

  const options = new chrome.Options();
  if (config.headless) {
    options.addArguments('--headless=new');
    options.addArguments('--disable-gpu');
  }
  options.addArguments('--window-size=1920,1080');

  driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

  return driver;
}

export async function quitDriver() {
  if (driver) {
    await driver.quit();
    driver = null;
  }
}
