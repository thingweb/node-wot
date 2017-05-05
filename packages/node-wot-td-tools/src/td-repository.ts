/*
 * The MIT License (MIT)
 * Copyright (c) 2017 the thingweb community
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

import ThingDescription from './thing-description';

/** This enales to discovery and manage TD's that are host in a TD repo */
export default class TDRepository {

  /* uri of the repo */
  private tdRepoURI: string;

  constructor(tdRepoURI: string) {
    this.tdRepoURI = tdRepoURI;
  }

  /** Adds a new TD to a repo
   * @param td TD instance
   * @param tdLifetime how long sold the the TD be saved in the repo
   * @return unique ID token that is provided of the repo to identify uploaded td within the repor
   */
  public addNewTD(td: ThingDescription, tdLifetime: number): string {

    return '';
  }

  /** Delete TD from repo
   * @param ID token that was provided by the TD repo
   * @return sucessful (=true) or not (=false)
   */
  public deleteTD(idTdToken: string): boolean {

    return true;
  }

  /** Check if td is still in repo (useful if you lost the id td token)
   * @param ID token that was provided by the TD repo
   * @return sucessful (=true) or not (=false)
   */
  public checkIfTDisInRepo(td: ThingDescription): string {

    return '';

  }

  /** Simple td search (e.g., provide the name of a Thing or interaction resources)
   * @param query free text search
   * @return return a list of TDs that match the search pattern
   */
  public freeTextSearch(query: string): Array<ThingDescription> {

    return [];
  }

  /** Triple td search
   * @param query SPARQL triple search
   * @return return a list of TDs that match the triple search pattern
   */
  public tripleSearch(query: string): Array<ThingDescription> {

    return [];
  }

}
