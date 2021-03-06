import { Glue42 } from "@glue42/desktop";

type Callback = ((data: any, context: Glue42.Channels.ChannelContext, updaterId: string) => void);

export class MockGlueChannels implements Partial<Glue42.Channels.API> {
    private allChannelNames: string[] = ["Red", "Green", "Blue"];
    private currentChannel: string; // not on a channel until you join one
    private data: { [key: string]: any } = {};
    private callbacks: Callback[] = [];

    public current() {
        return this.currentChannel;
    }

    public all() {
        return Promise.resolve(this.allChannelNames);
    }

    public subscribe(callback: Callback): () => void {
        this.callbacks.push(callback);
        this.notify(callback);
        return () => {
            this.callbacks = this.callbacks.filter(c => c !== callback);
        };
    }

    public publish(data: any, name?: string): Promise<void> {

        const channelToUpdate = name ?? this.current();
        if (!channelToUpdate){
            // not on a channel
            return;
        }
        // create the channel data if missing
        if (!this.data[channelToUpdate]) {
            this.data[channelToUpdate] = {};
        }
        // update the props coming from data
        for (const key of Object.keys(data)) {
            this.data[channelToUpdate][key] = data[key];
        }
        // notify subscribers
        if (channelToUpdate === this.current()) {
            this.notifyAll();
            return Promise.resolve();
        }
    }

    public join(name: string): Promise<void> {
        this.currentChannel = name;
        this.notifyAll();
        return Promise.resolve();
    }

    public leave(): Promise<void> {
        this.currentChannel = undefined;
        return Promise.resolve();
    }

    private notifyAll() {
        for (const callback of this.callbacks) {
            this.notify(callback);
        }
    }

    private notify(callback: Callback) {
        if (!this.current()) {
            // not on a channel
            return;
        }

        // get the data for the current channel
        const data = this.data[this.current()] ?? {};
        try {
            callback(data, { data, name: this.current(), meta: {} }, "1");
        } catch {
        }
    }
}