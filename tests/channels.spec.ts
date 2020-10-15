import puppeteer from "puppeteer";
import { CHANNELS_DATA_DIV } from "../src/channels";
import { MockGlueJS } from "../mock/mock";

describe("channels", function () {

  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      // Uncomment this to enable the browser UI.
      // headless: false
    });
  });

  // Comment this out if you want to leave the browser open after executing the tests.
  afterAll(async () => {
    await browser.close();
  })

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto("http://localhost:3000/index.html");
  });

  // Comment this out if you want to leave the pages in the browser open.
  afterEach(async () => {
    await page.close();
  });

  test(`joining a channel updates the ${CHANNELS_DATA_DIV} div`, async function () {
    // Update the "Red" Channel and then join it.
    const data = { a: 1 };
    await page.evaluate((data) => {
      const glue: MockGlueJS = (window as any).glue;
      glue.channels.publish(data, "Red");
      glue.channels.join("Red");
    }, data);

    // Verify that the `<div>` text is the published update.
    const div = await page.$(`#${CHANNELS_DATA_DIV}`);
    const innerText = await page.evaluate(element => element.innerText, div);
    expect(innerText).toEqual(JSON.stringify(data));
  });

  test(`pressing a button updates the ${CHANNELS_DATA_DIV} div`, async function () {
    // Join the "Red" Channel
    await page.evaluate(() => {
      const glue: MockGlueJS = (window as any).glue;
      glue.channels.join("Red");
    });

    // Click the button.
    await page.click("#channel-update-button");

    // Get the `<div>` text and verify that the value of `time` is a number.
    const div = await page.$(`#${CHANNELS_DATA_DIV}`);
    const innerText = await page.evaluate(element => element.innerText, div);
    const divObject = JSON.parse(innerText);    
    expect(typeof divObject.time === "number").toEqual(true);
  });
});