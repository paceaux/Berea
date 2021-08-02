const Entity = require('./entity.model');
const Book = require('./book.model');
const Chapter = require('./chapter.model');
const Passage = require('./passage.model');
const Verse = require('./verse.model');

/**
 * @typedef {import('../bibleService.js').BooksRequestParam} BooksRequestParam
 */
/**
 * @typedef {import('../bibleService.js').BookRequestParam} BookRequestParam
 */
/**
 * @typedef {import('../bibleService.js').chaptersRequestParam} chaptersRequestParam
 */
/**
 * @typedef {import('../bibleService.js').chapterRequestParam} chapterRequestParam
 */
/**
 * @typedef {import('../bibleService.js').passageRequestParam} passageRequestParam
 */
/**
 * @typedef {import('../bibleService.js').verseRequestParam} verseRequestParam
 */

/**
 * @typedef {import('../bibleService.js').BibleResponse} BibleResponse
 */

class Bible extends Entity {
  /**
   * @property {BibleResponse} data full data from api
   */

  /**
   * All books in the bible. populated after running refreshData()
   *
   * @type {Array<Book>}
   * @public
   */
    books = [];

    /**
     * Retrieves data from API and populates data property and books property.
     */
    async refreshData() {
      const data = await this.bibleService.getBible(this.id);
      const books = await this.getBooks();
      this.books.push(...books);
      this.data = data;
    }

    /**
     * Gets all of the books associated with the Bible
     *
     * @param  {BooksRequestParam} params parameters for retrieving books
     * @returns {Promise<Array<Book>>} Shallow copies of books
     */
    async getBooks(params) {
      const request = { ...params, id: this.id };
      let result = null;

      try {
        const books = await this.bibleService.getBooks(request);
        result = books.map((book) => new Book(book, this));
      } catch (getError) {
        result = getError;
      }
      return result;
    }

    /**
     * formats a request object so it to have the bible's id as id
     *
     * @param  {object} params parameters to submit to a request
     * @param  {string} requestId dude idk
     * @returns {object} request object with bibleId as id
     */
    prepareRequest(params, requestId) {
      const request = { id: this.id };
      if (typeof params === 'object') {
        const temp = { ...params };
        if (temp.id) {
          temp[requestId] = temp.id;
          delete temp.id;
        }
        Object.assign(request, temp);
      }

      if (typeof params === 'string') {
        request[requestId] = params;
      }
      return request;
    }

    /**
     * Gets a book from the Bible
     *
     * @param  {BookRequestParam|string} params either an object with id or bookId, or a string that is the bookId
     * @returns {Promise<Book>} Data for book of the bible
     */
    async getBook(params) {
      let result = null;
      const request = this.prepareRequest(params, 'bookId');

      try {
        const data = await this.bibleService.getBook(request);
        result = new Book(data, this);
      } catch (getError) {
        result = getError;
      }
      return result;
    }

    /**
     * Gets a chapter by Id from the Bible
     *
     * @param  {ChapterRequestParam|string} params options to pass into request
     * @returns {Promise<Chapter>} fully-populated chapter object
     */
    async getChapter(params) {
      let result = null;
      const request = this.prepareRequest(params, 'chapterId');

      try {
        const data = await this.bibleService.getChapter(request);
        result = new Chapter(data, this);
      } catch (getError) {
        result = getError;
      }
      return result;
    }

    /**
     * Gets a passage (range of verses)
     *
     * @param  {PassageRequestParam|string} params options to pass into request
     * @returns {Promise<Passage>} fully-populated chapter object
     */
    async getPassage(params) {
      let result = null;
      const request = this.prepareRequest(params, 'passageId');

      try {
        const data = await this.bibleService.getPassage(request);
        result = new Passage(data, this);
      } catch (getError) {
        result = getError;
      }
      return result;
    }

    /**
     * Gets a verse by Id from the Bible
     *
     * @param  {VerseRequestParam|string} params options to pass into request
     * @returns {Promise<Verse>} fully-populated verse object
     */
    async getVerse(params) {
      let result = null;
      const request = this.prepareRequest(params, 'verseId');

      try {
        const data = await this.bibleService.getVerse(request);
        result = new Verse(data, this);
      } catch (getError) {
        result = getError;
      }
      return result;
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
      const bibleId = this.id;
      let params = {
        id: bibleId,
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

module.exports = Bible;
