import { Glue42 } from "@glue42/desktop";

export class MockGlueInterop implements Partial<Glue42.Interop.API> {

    private _methods: Glue42.Interop.Method[] = [];

    public instance: Glue42.Interop.Instance = {
        application: "test_app",
        machine: "test_machine",
        user: "test_user",
        environment: "test_env",
        region: "test_reg",
    };

    public methods(filter?: string) {
        return this._methods;
    }

    public register<T = any, R = any>(methodDef: string | Glue42.Interop.MethodDefinition, handler: (args: T, caller: Glue42.Interop.Instance) => R | void | Promise<R>): Promise<void> {
       console.log(`registering method ${methodDef}`)
        methodDef = typeof methodDef === "string" ? { name: methodDef } : methodDef;
        const method: Glue42.Interop.Method = Object.assign({}, methodDef, {
            objectTypes: methodDef.objectTypes ?? [],
            supportsStreaming: false,
            getServers: () => {
                return [this.instance]
            },
            handler
        });
        
        this._methods.push(method);
        
        return Promise.resolve();
    }

    public invoke<T = any>(methodDef: string | Glue42.Interop.MethodDefinition, argumentObj?: object, target?: Glue42.Interop.InstanceTarget, options?: Glue42.Interop.InvokeOptions, success?: Glue42.Interop.InvokeSuccessHandler<T>, error?: Glue42.Interop.InvokeErrorHandler): Promise<Glue42.Interop.InvocationResult<T>> {
        const name = typeof methodDef === "string" ? methodDef : methodDef.name;
        const method = this.methods().find(m => m.name === name);
        if (!method) {
            return Promise.reject(`can not find method ${name}`);
        }
        const returned = (method as any).handler(argumentObj, this.instance);
        return Promise.resolve({
            returned,
            called_with: argumentObj || {},
            method,
            executed_by:this.instance,
            message: "",
        });
    }
}