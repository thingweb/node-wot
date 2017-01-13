/**
 * Resource that provides an asset
 */

import {logger} from '../logger'

export default class AssetResourceListener implements ResourceListener {
    private asset : string;
    constructor(asset : string) {
        this.asset = asset;
    }

    public onRead() : Buffer {
        return new Buffer(this.asset);
    }

    public onWrite(value : Buffer) : void {
        this.asset = value.toString();
    }

    public onInvoke(value : Buffer) : Buffer {
        return new Buffer("TODO");
    }

    public onUnlink() : void {

    }
}