import fs from 'fs';
import path from 'path';
import { Builder, By, WebDriver } from 'selenium-webdriver';
// tslint:disable-next-line: no-submodule-imports
import firefox from 'selenium-webdriver/firefox';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function createDriver() {
  const options = new firefox.Options();
  options.addArguments('-headless');

  return new Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(options)
    .build();
}

async function getGraphSelenium(driver: WebDriver) {
  await driver.get(
    'https://www.worldometers.info/coronavirus/coronavirus-cases/'
  );
  const chart = await driver.findElement(By.id('coronavirus-cases-linear'));
  const graph = await chart.getAttribute('innerHTML');
  return graph;
}

async function main() {
  while(true) {
    const driver = await createDriver();
    const graph = await getGraphSelenium(driver);
    fs.writeFileSync('public_html/linear.html', graph);
    await driver.get('file://' + path.resolve('public_html/linear.html'));
    await driver.manage().window().setRect({width: 720, height: 500});
    const image = await driver.takeScreenshot();
    fs.writeFileSync('./public_html/linear.png', image, 'base64')
    console.log('Files updated on disk. Sleeping for 10 min...')
    await sleep(10 * 60 * 1000);
  }
}


main();
