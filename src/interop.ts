import { Glue42 } from "@glue42/desktop";
export const INTEROP_SET_TEXT_METHOD_NAME = "set-text";
export const INTEROP_GET_TEXT_METHOD_NAME = "get-text";
export const INTEROP_SET_TEXT_DIV_NAME = "interop-register-div";
export const INTEROP_GET_TEXT_DIV_NAME = "interop-invoke-div";

/**
 * This function registers an Interop method and updates the "#interop-register-div" with the argument of the invocation.
 */
export function registerInterop(glue: Glue42.Glue) {    
    glue.interop.register(INTEROP_SET_TEXT_METHOD_NAME, (args) => {
        const registerDiv = document.getElementById(INTEROP_SET_TEXT_DIV_NAME);        
        registerDiv.innerText = JSON.stringify(args);
    });
}

/**
 * This function invokes an Interop method and updates the "#interop-invoke-div" with the result from the invocation.
 */
export async function getExternalInteropData(glue: Glue42.Glue) {
    const result = await glue.interop.invoke(INTEROP_GET_TEXT_METHOD_NAME);
    const registerDiv = document.getElementById(INTEROP_GET_TEXT_DIV_NAME);        
    registerDiv.innerText =  JSON.stringify(result.returned);
}