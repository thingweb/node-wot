/**
 * Generic helper functions used across the code
 * These Helpers are used like this:
 * ```
 * import Helpers from './helpers'
 * 
 * ...
 * Helpers.foo(bar)
 * ...
 * ```
 */

export default class Helpers {
    static extractScheme(uri : string)  {
        let colon = uri.indexOf(':')
        return uri.substr(0,colon)
    }
}