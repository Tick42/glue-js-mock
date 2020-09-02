import { MockGlueWindows } from "./mock.windows";
import { MockGlueInterop } from "./mock.interop";
import { MockGlueContexts } from "./mock.contexts";
import { MockGlueChannels } from "./mock.channels";

export class MockGlueJS {
    public windows = new MockGlueWindows();
    public interop = new MockGlueInterop();
    public channels = new MockGlueChannels();
    public contexts = new MockGlueContexts();
}


