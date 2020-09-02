import puppeteer from "puppeteer";
import { INTEROP_SET_TEXT_METHOD_NAME, INTEROP_GET_TEXT_METHOD_NAME, INTEROP_SET_TEXT_DIV_NAME, INTEROP_GET_TEXT_DIV_NAME } from "../src/interop";

describe("interop", function () {

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

  test(`invoking ${INTEROP_SET_TEXT_METHOD_NAME} updates the ${INTEROP_SET_TEXT_DIV_NAME} div`, async function () {
    const invokeArgument = { text: "Hello" };

    // invoke method
    await page.evaluate((method, invokeArgument) => {
      (window as any).glue.interop.invoke(method, invokeArgument);
    }, INTEROP_SET_TEXT_METHOD_NAME, invokeArgument);

    // verify the div text
    const element = await page.$(`#${INTEROP_SET_TEXT_DIV_NAME}`);
    const innerText = await page.evaluate(element => element.innerText, element);
    expect(innerText).toEqual(JSON.stringify(invokeArgument));
  });

  test(`pressing a button calls ${INTEROP_GET_TEXT_METHOD_NAME} updates the ${INTEROP_GET_TEXT_DIV_NAME} div`, async function () {
    const result = { text: "Hello" };

    // register a method that will be invoked when the button is pressed
    await page.evaluate((method, result) => {
      console.log(`registering ${method}`);
      (window as any).glue.interop.register(method, () => {
        console.log(`calling`);
        return result;
      });
    }, INTEROP_GET_TEXT_METHOD_NAME, result);

    // press the button
    await page.click("#interop-get-external-data-button");

    // get the div text and compare
    const element = await page.$(`#${INTEROP_GET_TEXT_DIV_NAME}`);
    const innerText = await page.evaluate(element => element.innerText, element);
    expect(innerText).toEqual(JSON.stringify(result));
  });
});

