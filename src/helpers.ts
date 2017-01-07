/**
 * Generic helper functions used across the code
 * These Helpers are used like this:
 * ```
 * import * as Helpers from './helpers'
 * 
 * ...
 * Helpers.foo(bar)
 * ...
 * ```
 */

export function extractScheme(uri: string) {
    let colon = uri.indexOf(':')
    return uri.substr(0, colon)
}
