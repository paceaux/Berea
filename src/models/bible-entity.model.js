const Entity = require('./entity.model');
const Bible = require('./bible.model');

/**
 * @typedef {import('../bible.model.js')} Bible
 */
/**
 * Abstract class for any item within context of a Bible
 *
 * @class BibleEntity
 * @augments Entity
 */
class BibleEntity extends Entity {
  /**
   * @type {Bible}
   * @public
   */
  bible = null;

  /**
   * @param  {object} data Some sort of response data
   * @param  {Bible} bible A Bible object
   */
  constructor(data, bible) {
    super(data, bible.bibleService);

    if (typeof bible === 'string') {
      this.bible = new Bible(bible, bible.bibleService);
    } else {
      this.bible = bible;
    }
  }

  /**
   * @param searchParams
   * @typedef SearchRequestParam
   * @property {string} query Search keywords or passage reference. Supported wildcards are * and ?.
   * @property {string} q Search keywords or passage reference. Supported wildcards are * and ?.
   * @property {number} [limit=10] Integer limit for how many matching results to return.
   * @property {number} [l=10] Integer limit for how many matching results to return.
   * @property {number} [offset] used to paginate results
   * @property {number} [o] used to paginate results
   * @property {'relevance'|'canonical'|'reverse-canonical'} [sort='relevance'] Sort order of results.
   * @property {'relevance'|'canonical'|'reverse-canonical'} [s='relevance'] Sort order of results.
   * @property {string} range Comma separated passage ids the search will be limited to.
   * @property {string} r Comma separated passage ids the search will be limited to.
   * @property {string} passage Comma separated passage ids the search will be limited to.
   * @property {string} passages Comma separated passage ids the search will be limited to.
   * @property {'AUTO'|0|1|2}  fuzziness of a search to account for misspellings.
   * @property {'AUTO'|0|1|2}  f of a search to account for misspellings.
   */

  /**
   * @param  {string|SearchRequestParam} searchParams string or object for search request
   * @returns {import('../bibleService.js').SearchResponse} result from searching the entity
   */
  async search(searchParams) {
    const range = this.id;
    const bibleId = this.bible.id;
    let params = {
      id: bibleId,
      range,
    };
    let result = null;

    if (typeof searchParams === 'string') {
      params.query = searchParams;
    }

    if (typeof searchParams === 'object') {
      const temp = this.bibleService.constructor.getRoutesAndParamFromRequest(searchParams);
      delete temp.id;
      params = { ...params, ...temp.params };
    }
    try {
      result = await this.bibleService.search(params);
    } catch (searchError) {
      result = searchError;
    }
    return result;
  }
}

module.exports = BibleEntity;
