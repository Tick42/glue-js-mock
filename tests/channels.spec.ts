import puppeteer from "puppeteer";
import { CHANNELS_DATA_DIV } from "../src/channels";
import { MockGlueJS } from "../mock/mock";

describe("channels", function () {

  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      // headless: false,
    });
  });

  afterAll(async () => {
    await browser.close();
  })

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto("http://localhost:3000/index.html");
  });

  afterEach(async () => {
    await page.close();
  });

  test(`joining a channel updates the ${CHANNELS_DATA_DIV} div`, async function () {
    // update the RED channel and then join it
    const data = { a: 1 };
    await page.evaluate((data) => {
      const glue: MockGlueJS = (window as any).glue;
      glue.channels.publish(data, "Red");
      glue.channels.join("Red");
    }, data);

    // verify the div text is the update we published
    const div = await page.$(`#${CHANNELS_DATA_DIV}`);
    const innerText = await page.evaluate(element => element.innerText, div);
    expect(innerText).toEqual(JSON.stringify(data));
  });

  test(`pressing a button updates the ${CHANNELS_DATA_DIV} div`, async function () {
    // join the RED channel
    await page.evaluate(() => {
      const glue: MockGlueJS = (window as any).glue;
      glue.channels.join("Red");
    });

    // press the button
    await page.click("#channel-update-button");

    // get the div text and verify time is number
    const div = await page.$(`#${CHANNELS_DATA_DIV}`);
    const innerText = await page.evaluate(element => element.innerText, div);
    const divObject = JSON.parse(innerText);    
    expect(typeof divObject.time === "number").toEqual(true);
  });
});

