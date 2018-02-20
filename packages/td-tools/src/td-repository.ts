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
