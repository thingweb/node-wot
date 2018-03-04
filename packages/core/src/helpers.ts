/*
 * W3C Software License
 *
 * Copyright (c) 2018 the thingweb community
 *
 * THIS WORK IS PROVIDED "AS IS," AND COPYRIGHT HOLDERS MAKE NO REPRESENTATIONS OR
 * WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO, WARRANTIES OF
 * MERCHANTABILITY OR FITNESS FOR ANY PARTICULAR PURPOSE OR THAT THE USE OF THE
 * SOFTWARE OR DOCUMENT WILL NOT INFRINGE ANY THIRD PARTY PATENTS, COPYRIGHTS,
 * TRADEMARKS OR OTHER RIGHTS.
 *
 * COPYRIGHT HOLDERS WILL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, SPECIAL OR
 * CONSEQUENTIAL DAMAGES ARISING OUT OF ANY USE OF THE SOFTWARE OR DOCUMENT.
 *
 * The name and trademarks of copyright holders may NOT be used in advertising or
 * publicity pertaining to the work without specific, written prior permission. Title
 * to copyright in this work will at all times remain with copyright holders.
 */

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

import * as url from 'url';
import * as os from 'os'

export function extractScheme(uri: string) {
  let parsed = url.parse(uri);
  // console.log(parsed)
  // remove trailing ':'
  if (parsed.protocol === null) {
    throw new Error(`Protocol in url "${uri}" must be valid`)
  }
  let scheme = parsed.protocol.slice(0, -1);
  console.debug(`Helpers found scheme '${scheme}'`);
  return scheme;
}

export function getAddresses(): Array<string> {
  let addresses: Array<any> = [];

  let interfaces = os.networkInterfaces();

  for (let iface in interfaces) {
    interfaces[iface].forEach((entry: any) => {
      console.debug(`AddressHelper found ${entry.address}`);
      if (entry.internal === false) {
        if (entry.family === 'IPv4') {
          addresses.push(entry.address);
        } else if (entry.scopeid === 0) {
          addresses.push(entry.address);
        }
      }
    });
  }

  //addresses.push('127.0.0.1');

  console.debug(`AddressHelper identified ${addresses}`);

  return addresses;
}

export function toUriLiteral(address: string): string {
  if (address.indexOf(':') !== -1) {
    address = `[${address}]`;
  }
  return address;
}

