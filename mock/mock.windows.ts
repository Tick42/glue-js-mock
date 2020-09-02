import {Glue42} from "@glue42/desktop";

export class MockGlueWindows implements Partial<Glue42.Windows.API> {
    private myWindow: any;
    private callback: any;

    constructor(private context: any = {}) {

        this.myWindow = {
            context,
            onContextUpdated: (callback: any) => {
                this.callback = callback;
            },
            updateContext: (context: any) => {
                this.context = context;
                if (this.callback) {
                    this.callback(context);
                }
            },
            id: 'glue.windows.my().id'
        };
    }

    public my(): Glue42.Windows.GDWindow {
        return this.myWindow;
    }

    public list(): Glue42.Windows.GDWindow[] {
        return [this.myWindow];
    }
}