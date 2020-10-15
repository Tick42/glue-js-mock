import GlueFactory, { Glue42 } from "@glue42/desktop";
import { MockGlueJS } from "../mock/mock";
import { registerInterop, getExternalInteropData } from "./interop";
import { subscribeChannels, updateChannel } from "./channels";

let glue: Glue42.Glue;

(async function main() {
    if (window.glue42gd) {
        // Running in Glue42.
        glue = await GlueFactory({ channels: true });
    } else {
        // Running outside Glue42.
        glue = new MockGlueJS() as unknown as Glue42.Glue;
    }
    (window as any).glue = glue;

    registerInterop(glue);
    subscribeChannels(glue);
})();

(window as any).onInteropInvokeButton = () => {
    getExternalInteropData(glue);
}

(window as any).onChannelUpdateButton = () => {
    updateChannel(glue);
}