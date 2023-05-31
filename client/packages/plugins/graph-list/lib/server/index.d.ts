import { InstallOptions, Plugin } from '@tugraph/openpiece-server';
export declare class HelloPlugin extends Plugin {
    beforeLoad(): void;
    load(): Promise<void>;
    disable(): Promise<void>;
    install(options: InstallOptions): Promise<void>;
}
export default HelloPlugin;
