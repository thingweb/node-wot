/**
 * Resource that provides an asset
 */

import {logger} from "../logger";

export default class AssetResourceListener implements ResourceListener {
    private asset : string;
    constructor(asset : string) {
        this.asset = asset;
    }

    public onRead() : Promise<Buffer> {
        logger.debug(`Reading asset`);
        return new Promise<Buffer>(
            (resolve,reject) => resolve(new Buffer(this.asset))
        );
    }

    public onWrite(value : Buffer) : Promise<void> {
        logger.debug(`Writing '${value.toString()}' to asset`);
        this.asset = value.toString();
        return new Promise<void>((resolve,reject) => resolve())
    }

    public onInvoke(value : Buffer) : Promise<Buffer> {
        logger.debug(`Invoking '${value.toString()}' on asset`);
        return new Promise<Buffer>(
            (resolve,reject) => resolve(new Buffer('TODO'))
        );
    }

    public onUnlink() : Promise<void> {
        logger.debug(`Unlinking asset`);
        return new Promise<void>((resolve,reject) => reject(new Error("Unlinking assets not allowed")))
    }
}