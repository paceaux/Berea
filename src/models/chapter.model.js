const BibleEntity = require('./bible-entity.model');

/**
 * @typedef {import('../bibleService.js').ChapterResponse} ChapterResponse
 */
/**
 * Chapter of a Book
 *
 * @class Chapter
 * @augments BibleEntity
 */
class Chapter extends BibleEntity {
  /**
   * @property {ChapterResponse} data full data from api
   */

  /**
   * Name of book and chapter, or undefined if data not refreshed
   *
   * @type {string|undefined}
   */
  get name() {
    return this.data.reference;
  }

  /**
   * id for the book which contains this chapter
   *
   * @type {string}
   */
  get bookId() {
    return Chapter.parseId(this.id).bookId;
  }

  /**
   * chapter number. Intros will return 0
   *
   * @type {number}
   */
  get number() {
    return Chapter.parseId(this.id).chapterNumber;
  }

  /**
   * Trimmed raw content from API if data has been refreshed or loaded
   *
   * @type {string}
   */
  get content() {
    return Chapter.cleanContent(this.data.content);
  }

  /**
   * number of verses in the chapter or 0 if data has not been refreshed or loaded
   *
   * @type {number}
   */
  get verseCount() {
    return this.data.verseCount || 0;
  }

  /**
   * Array of verses if data has been refreshed or loaded
   *
   * @type {Array<string>}
   */
  get verseList() {
    const verses = [];

    if (this.verseCount > 0) {
      verses.push(...Chapter.parseVerses(this.data.content));
    }
    return verses;
  }

  /**
   * The previous chapter in the book, or null if data is not refreshed/loaded
   *
   * @type {Chapter|null}
   */
  get previousChapter() {
    let chapter = null;
    const { data: { previous } } = this;

    if (previous && previous.id) {
      chapter = new Chapter(previous.id, this.bible);
    }
    return chapter;
  }

  /**
   * The next chapter in the book, or null if data is not refreshed/loaded
   *
   * @type {Chapter|null}
   */
  get nextChapter() {
    let chapter = null;
    const { data: { next } } = this;

    if (next && next.id) {
      chapter = new Chapter(next.id, this.bible);
    }
    return chapter;
  }

  /**
   * gets previous chapter in the book
   *
   * @returns {Chapter|null} preceding chapter in book
   */
  async getPrevious() {
    const chapter = this.previousChapter;
    if (!chapter) return null;

    try {
      await chapter.refreshData();
    } catch (getChapterError) {
      // this doesn't return. Want to surface the error somehow
      // eslint-disable-next-line no-console
      console.error(getChapterError);
    }

    return chapter;
  }

  /**
   * gets next chapter in the book
   *
   * @returns {Chapter|null} succeeding chapter in book
   */
  async getNext() {
    const chapter = this.nextChapter;
    if (!chapter) return null;

    try {
      await chapter.refreshData();
    } catch (getChapterError) {
      // this doesn't return. Want to surface the error somehow
      // eslint-disable-next-line no-console
      console.error(getChapterError);
    }

    return chapter;
  }

  /**
   * Populates data if constructed with a string, or retrieves data not present at instantiation
   * This will load the content, verses, and previous/nextChapters properties
   *
   * @returns {Promise<void>}
   */
  async refreshData() {
    const data = await this.bibleService.getChapter(
      {
        contentType: 'text',
        id: this.bible.id,
        chapterId: this.id,
      },
    );
    this.data = data;
  }
}

module.exports = Chapter;
