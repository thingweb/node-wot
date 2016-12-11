declare interface ProtocolServer {
    addResource(path: string, res: Resource): Resource;
    removeResource(path: string): boolean;
    start(): boolean;
    stop(): boolean;
}

declare interface Resource {
    read(): Object;
    write(payload: Object): Object;
    execute(payload: Object): Object;
    unlink(): Object;
}
