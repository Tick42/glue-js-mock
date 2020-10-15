import puppeteer from "puppeteer";
import { INTEROP_SET_TEXT_METHOD_NAME, INTEROP_GET_TEXT_METHOD_NAME, INTEROP_SET_TEXT_DIV_NAME, INTEROP_GET_TEXT_DIV_NAME } from "../src/interop";

describe("interop", function () {

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

  test(`invoking ${INTEROP_SET_TEXT_METHOD_NAME} updates the ${INTEROP_SET_TEXT_DIV_NAME} div`, async function () {
    const invokeArgument = { text: "Hello" };

    // Invoke the "set-text" Interop method.
    await page.evaluate((method, invokeArgument) => {
      (window as any).glue.interop.invoke(method, invokeArgument);
    }, INTEROP_SET_TEXT_METHOD_NAME, invokeArgument);

    // Verify the `<div>` text.
    const element = await page.$(`#${INTEROP_SET_TEXT_DIV_NAME}`);
    const innerText = await page.evaluate(element => element.innerText, element);
    expect(innerText).toEqual(JSON.stringify(invokeArgument));
  });

  test(`pressing the "interop-get-external-data-button" calls ${INTEROP_GET_TEXT_METHOD_NAME} and updates the ${INTEROP_GET_TEXT_DIV_NAME} div with the result of the interop method`, async function () {
    const result = { text: "Hello" };

    // Register an Interop method that will be invoked when the button is clicked.
    await page.evaluate((method, result) => {
      (window as any).glue.interop.register(method, () => {
        return result;
      });
    }, INTEROP_GET_TEXT_METHOD_NAME, result);

    // Click the button.
    await page.click("#interop-get-external-data-button");

    // Get the `<div>` text and compare it to the value returned by the Interop method.
    const element = await page.$(`#${INTEROP_GET_TEXT_DIV_NAME}`);
    const innerText = await page.evaluate(element => element.innerText, element);
    expect(innerText).toEqual(JSON.stringify(result));
  });
});