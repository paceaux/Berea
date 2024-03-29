const BibleEntity = require('./bible-entity.model');
const Chapter = require('./chapter.model');
/**
 * @typedef {import('../bibleService.js').BookResponse} BookResponse
 */

/**
 * Book of a Bible
 *
 * @class Book
 * @augments BibleEntity
 */
class Book extends BibleEntity {
  /**
   * @property {BookResponse} data full data from api
   */

  /**
   * All chapters in the book. populated after running refreshData()
   *
   * @type {Array<Chapter>}
   * @public
   */
  chapters = [];

  /**
   * Name of the book
   *
   * @type {string}
   */
  get name() {
    return this.data.name;
  }

  /**
   * Full name (or short description)
   *
   * @type {string}
   */
  get longName() {
    return this.data.nameLong;
  }

  /**
   * Abbreviation used by the API
   *
   * @type {string}
   */
  get abbreviation() {
    return this.data.abbreviation;
  }

  /**
   * Populates data if constructed with a string, or retrieves data not present at instantiation
   * This will load the chapters property with chapters
   *
   * @returns {Promise<void>}
   */
  async refreshData() {
    const data = await this.bibleService.getBook(this.bible.id, this.id);
    const chapters = await this.getChapters();
    this.data = data;
    this.chapters = chapters;
  }

  /**
   * Retrieves all chapters for this book
   *
   * @param  {import('../bibleService.js').ChapterRequestParam} [params] request parameters
   * @returns {Promise<Array<Chapter>>} an array of chapters in the book
   */
  async getChapters(params = {}) {
    const request = { ...params, bookId: this.id, id: this.bible.id };
    let result = null;

    try {
      const chapters = await this.bibleService.getChaptersFromBook(request);
      result = chapters.map((chapter) => new Chapter(chapter, this.bible));
    } catch (getError) {
      result = getError;
    }

    return result;
  }
}

module.exports = Book;
