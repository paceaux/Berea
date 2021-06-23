const Entity = require('./entity.model');
const Book = require('./book.model');
const Chapter = require('./chapter.model');
const Passage = require('./passage.model');
const Verse = require('./verse.model');

/**
 * @typedef BooksRequestParam
 * @property {string} id id of the Bible whose book to fetch
 * @property {boolean} [includeChapters=false] An array of chapter summaries should be in the results.
 * @property {boolean} [includeChaptersAndSections=false] Arrays of chapter summaries and sections should be in the results
 */

/**
 * @typedef BookRequestParam
 * @property {string} id id of the Bible whose book to fetch
 * @property {string} bookId id of the book to fetch (e.g. GEN)
 * @property {boolean} [includeChapters=false] Array of chapter summaries should be in the results.
 */

/**
 * @typedef ChaptersRequestParam
 * @property {string} id id of the Bible whose book to fetch
 * @property {string} chapterId id of the chapter to fetch (e.g. GEN.1)
 * @property {boolean} [includeChapters=false] An array of chapter summaries should be in the results.
 */

/**
 * @typedef ChapterRequestParam
 * @property {string} id id of the Bible whose book to fetch
 * @property {string} chapterId id of the chapter to fetch (e.g. GEN.1)
 * @property {string} [contentType] html, json, text
 * @property {boolean} [includeNotes] include footnotes in content
 * @property {boolean} [includeTitles] include footnotes in content
 * @property {boolean} [includeChapterNumbers] include chapter numbers in content
 * @property {boolean} [includeVerseNumbers] include verse numbers in content
 * @property {boolean} [includeVerseSpans] include spans that wrap verse numbers and verse text for bible content
 * @property {Array<string>} [parallels] comma separated list of bibleIds
 * @property {boolean} [includeChapters=false] Boolean indicating if an array of chapter summaries should be in the results.
 */

/**
 * @typedef PassageRequestParam
 * @property {string} id id of the Bible whose book to fetch
 * @property {string} passageId id of the passage to fetch (e.g. GEN.1.1-GEN.2.20)
 * @property {string} [contentType=html] html, json, text
 * @property {boolean} [includeNotes] include footnotes in content
 * @property {boolean} [includeTitles=true] include footnotes in content
 * @property {boolean} [includeChapterNumbers=false] include chapter numbers in content
 * @property {boolean} [includeVerseNumbers=false] include verse numbers in content
 * @property {boolean} [includeVerseSpans=false] include spans that wrap verse numbers and verse text for bible content
 * @property {Array<string>} [parallels] comma separated list of bibleIds
 * @property {boolean} [useOrgId=false] Use the supplied id(s) to match the verseOrgId instead of verseId.
 */

/**
 * @typedef VerseRequestParam
 * @property {string} id id of the Bible whose book to fetch
 * @property {string} verseId id of the verse to fetch (e.g. GEN.1.1)
 * @property {string} [contentType=html] html, json, text
 * @property {boolean} [includeNotes] include footnotes in content
 * @property {boolean} [includeTitles=true] include footnotes in content
 * @property {boolean} [includeChapterNumbers=false] include chapter numbers in content
 * @property {boolean} [includeVerseNumbers=false] include verse numbers in content
 * @property {boolean} [includeVerseSpans=false] include spans that wrap verse numbers and verse text for bible content
 * @property {Array<string>} [parallels] comma separated list of bibleIds
 * @property {boolean} [useOrgId=false] Use the supplied id(s) to match the verseOrgId instead of verseId.
 */
class Bible extends Entity {
    /**
     * All books in the bible. populated after running refreshData()
     *
     * @type {Array<string>}
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
     * @returns {Array<Book>} Shallow copies of books
     */
    async getBooks(params) {
      const request = { ...params, id: this.id };
      let result = null;

      try {
        const books = await this.bibleService.getBooks(request);
        result = books.map((book) => new Book(book, this));
      } catch (getError) {
        console.log(getError);
        result = getError;
      }
      return result;
    }

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
     * @returns {Book} Data for book of the bible
     */
    async getBook(params) {
      let result = null;
      const request = this.prepareRequest(params, 'bookId');

      try {
        const data = await this.bibleService.getBook(request);
        result = new Book(data, this);
      } catch (getError) {
        console.log(getError);
        result = getError;
      }
      return result;
    }

    /**
     * Gets a chapter by Id from the Bible
     *
     * @param  {ChapterRequestParam|string} params options to pass into request
     * @returns {Chapter} fully-populated chapter object
     */
    async getChapter(params) {
      let result = null;
      const request = this.prepareRequest(params, 'chapterId');

      try {
        const data = await this.bibleService.getChapter(request);
        result = new Chapter(data, this);
      } catch (getError) {
        console.log(getError);
        result = getError;
      }
      return result;
    }

    /**
     * Gets a passage (range of verses)
     *
     * @param  {PassageRequestParam|string} params options to pass into request
     * @returns {Passage} fully-populated chapter object
     */
    async getPassage(params) {
      let result = null;
      const request = this.prepareRequest(params, 'passageId');

      try {
        const data = await this.bibleService.getPassage(request);
        result = new Passage(data, this);
      } catch (getError) {
        console.log(getError);
        result = getError;
      }
      return result;
    }

    /**
     * Gets a verse by Id from the Bible
     *
     * @param  {VerseRequestParam|string} params options to pass into request
     * @returns {Verse} fully-populated verse object
     */
    async getVerse(params) {
      let result = null;
      const request = this.prepareRequest(params, 'verseId');

      try {
        const data = await this.bibleService.getVerse(request);
        result = new Verse(data, this);
      } catch (getError) {
        console.log(getError);
        result = getError;
      }
      return result;
    }
}

module.exports = Bible;
