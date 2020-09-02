# Overview 
(!) Note: this repo is a work in progress

This repo shows how a Glue42 enabled application can be tested outside of Glue42 env using a mocked version of the Glue.js library.

# Details

The repo contains a simple Glue42 enabled application that does the following:
* Interop related
  * registers a Glue42 interop method - when invoked a div is updated with the argument of the interop call
  * when the "Get external data" button is clicked it invokes external interop method and displays the result in a div
* Channels related
  * displays the context of the currently selected color channel in a div
  * when the "Update channel" button is clicked updates the context of the current color channel

Those functionalities aim to demonstrate simple Glue42 integrations that are typical for a real Glue42 enabled application.

## Structure
* src - the source of the sample app
* test - puppeteer tests of the sample app
* mock - glue mock that is used to mimic glue in test env

## Detecting the env
You can detect if you're running in Glue42 by checking if the glue42gd is attached to the window object.

```javascript
// main.ts

    if (window.glue42gd) {
        glue = await GlueFactory();
    } else {
        glue = new MockGlueJS() as unknown as Glue42.Glue;
    }

```

## The glue mock
The mock is a partial implementation of the Glue API used in testing to mimic the glue APIs.

Currently the mock has partial support for:
* interop
* channels
* contexts
* window's context

The mock code should be moved into your application and can be extended/modified to support your app in a better way.

## Tests
We use puppeteer to test the app in this sample, however the mock is not tied up to puppeteer and can be used with any other 

### Accessing the mocked glue

# Running the tests
```script
npm i 
npm test
```
