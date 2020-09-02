import { Glue42 } from "@glue42/desktop";

export class MockGlueContexts implements Partial<Glue42.Contexts.API> {
    private _all: { [key: string]: any } = {};
    private _callbacks: { [key: string]: any[] } = {};

    public all() {
        return Object.keys(this._all);
    }

    public update(name: string, data: any): Promise<void> {
        if (!this._all[name]) {
            this._all[name] = {};
        }
        const current = this._all[name];
        for (const key of Object.keys(data)) {
            current[key] = data[key];
        }
        this.notify(name);
        return Promise.resolve();
    }

    public set(name: string, data: any): Promise<void> {
        this._all[name] = data;
        this.notify(name);
        return Promise.resolve();
    }

    public subscribe(name: string, callback: (data: any, delta: any, removed: string[], unsubscribe: () => void, extraData?: any) => void): Promise<() => void> {
        if (!this._callbacks[name]) {
            this._callbacks[name] = [];
        }
        this._callbacks[name].push(callback);
        return Promise.resolve(() => { });
    }

    public get(name: string): Promise<any> {
        return Promise.resolve(this._all[name] ?? {});
    }

    private notify(name: string) {
        const callbacks = this._callbacks[name];
        if (callbacks){
            const data = this._all[name];
            for(const callback of callbacks){
                callback(data);
            }
        }
    }
}