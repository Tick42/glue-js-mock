# Overview 

*Note that this repo is a work in progress.*

This repo contains an example of how to test a Glue42 enabled application outside the Glue42 environment (e.g., in a browser) using a mocked version of the Glue42 JavaScript library.

# Structure

- `/mock` - Glue42 mock that is used to mimic the Glue42 JavaScript library in a testing environment;
- `/src` - the source of a sample Glue42 enabled app;
- `/test` - [Puppeteer](https://developers.google.com/web/tools/puppeteer) tests of the sample app;

# Glue42 Mock

The Glue42 mock is a partial implementation of the Glue42 JavaScript API used in testing to mimic the Glue42 APIs.

Currently, the mock has partial support for:

- [Interop](https://docs.glue42.com/glue42-concepts/data-sharing-between-apps/interop/javascript/index.html)
- [Shared Contexts](https://docs.glue42.com/glue42-concepts/data-sharing-between-apps/shared-contexts/javascript/index.html)
- [Channels](https://docs.glue42.com/glue42-concepts/data-sharing-between-apps/channels/javascript/index.html)
- [Glue42 Window context](https://docs.glue42.com/glue42-concepts/windows/window-management/javascript/index.html#context)

Move the mock code in your application and extend/modify it to support your app in a better way.

# Sample Glue42 Enabled App

The sample Glue42 enabled application has the following functionalities:

- Interop:
    - [registers](https://docs.glue42.com/glue42-concepts/data-sharing-between-apps/interop/javascript/index.html#method_registration) a Glue42 Interop method which when [invoked](https://docs.glue42.com/glue42-concepts/data-sharing-between-apps/interop/javascript/index.html#method_invocation), updates a `<div>` with the argument of the Interop call;
    - when the "Get External Data" button is clicked, an external Interop method is invoked and the result is displayed in a `<div>`;

- Channels:
    - displays the context of the currently selected color Channel in a `<div>`;
    - when the "Update channel" button is clicked, the context of the currently selected Color channel is updated;

These functionalities showcase a real (although simplified) usage of Glue42 in web apps.

## Detecting the Environment

To detect whether your app is running in Glue42, check for the `glue42gd` object attached to the global `window` object:

```javascript
// main.ts
import GlueFactory, { Glue42 } from "@glue42/desktop";
import { MockGlueJS } from "../mock/mock";

...

if (window.glue42gd) {
    glue = await GlueFactory();
} else {
    glue = new MockGlueJS() as unknown as Glue42.Glue;
};
```

# Tests

[Puppeteer](https://developers.google.com/web/tools/puppeteer) is used to test the sample Glue42 enabled app, however, the Glue42 mock is not tied up to Puppeteer and can be used with other tools as well.

See below the step-by-step example of creating a test for your app. The example uses one of the tests in this repo which verifies that pressing a button on the page updates a `<div>` with the result of an external Interop method.

1. [Register](https://docs.glue42.com/glue42-concepts/data-sharing-between-apps/interop/javascript/index.html#method_registration) a new Interop method that will be invoked by the web. Access the mocked Glue42 attached to the `window` object to do so:

```javascript
await page.evaluate((method, result) => {
    (window as any).glue.interop.register(method, () => {
        return result;
    });
}, INTEROP_GET_TEXT_METHOD_NAME, result);
```

2. Simulate a button click that will [invoke](https://docs.glue42.com/glue42-concepts/data-sharing-between-apps/interop/javascript/index.html#method_invocation) the Interop method and update the `<div>` in the page:

```javascript
// Click the button.
await page.click("#interop-get-external-data-button");
```

3. To verify the result from the operation, extract the text from the `<div>` and compare it to the result returned by the Interop method:

```javascript
// Get the `<div>` text and compare it to the result returned by the Interop method.
const element = await page.$(`#${INTEROP_GET_TEXT_DIV_NAME}`);
const innerText = await page.evaluate(element => element.innerText, element);

expect(innerText).toEqual(JSON.stringify(result));
```

## Running the Tests

To execute the included tests, run the following commands:

```script
npm install
npm test
```

*The provided tests are executed by using a "headless" browser (no browser UI). If you want to see the results from the tests in the app, use the `headless: false` setting when launching a browser instance and comment out the `afterAll()` and `afterEach()` statements in the test files to avoid closing the browser pages and the browser itself.*