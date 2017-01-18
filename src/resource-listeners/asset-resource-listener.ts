/**
 * Resource that provides an asset
 */

import {logger} from '../logger'

export default class AssetResourceListener implements ResourceListener {
    private asset : string;
    constructor(asset : string) {
        this.asset = asset;
    }

    public onRead() : Promise<Buffer> {
        return new Promise<Buffer>(
            (resolve,reject) => resolve(new Buffer(this.asset))
        );
    }

    public onWrite(value : Buffer) : Promise<void> {
        this.asset = value.toString();
        return new Promise<void>((resolve,reject) => resolve())
    }

    public onInvoke(value : Buffer) : Promise<Buffer> {
        return new Promise<Buffer>(
            (resolve,reject) => resolve(new Buffer('TODO'))
        );
    }

    public onUnlink() : Promise<void> {
        return new Promise<void>((resolve,reject) => resolve())
    }
}