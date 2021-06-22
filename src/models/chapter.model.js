const BibleEntity = require('./bible-entity.model');

/**
 * @type {import('../bibleService').Chapter}
 */
class Chapter extends BibleEntity {
  /** Name of book and chapter, or undefined if data not refreshed
     * @type {string|undefined}
     */
  get name() {
    return this.data.reference;
  }

  /** id for the book which contains this chapter
     * @type {string}
     */
  get bookId() {
    return Chapter.parseId(this.id).bookId;
  }

  /** chapter number. Intros will return 0
     * @type {number}
     */
  get number() {
    return Chapter.parseId(this.id).chapterNumber;
  }

  /** Trimmed raw content from API if data has been refreshed or loaded
     * @type {string}
     */
  get content() {
    const strContent = this.data.content;
    let content = '';

    if (strContent) {
      content = strContent.trim();
    }

    return content;
  }

  /** number of verses in the chapter or 0 if data has not been refreshed or loaded
     * @type {number}
     */
  get verseCount() {
    return this.data.verseCount || 0;
  }

  /** Array of verses if data has been refreshed or loaded
     * @type {array<string>}
     */
  get verseList() {
    const verses = [];

    if (typeof this.content === 'string' && this.verseCount > 0) {
      const splitRegex = new RegExp(/(?:\[[0-9]+\]\s)/);
      const verseSplit = this.content.split(splitRegex);
      const verseArray = verseSplit.map((verse) => verse.trim().replace('\n', ''));
      verses.push(...verseArray.filter((el) => el));
    }
    return verses;
  }

  /** The previous chapter in the book, or null if data is not refreshed/loaded
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

  /** The next chapter in the book, or null if data is not refreshed/loaded
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

  /** gets previous chapter in the book
     * @returns {Chapter|null}
     */
  async getPrevious() {
    const chapter = this.previousChapter;
    if (!chapter) return null;

    try {
      await chapter.refreshData();
    } catch (getChapterError) {
      console.error(getChapterError);
    }

    return chapter;
  }

  /** gets next chapter in the book
     * @returns {Chapter|null}
     */
  async getNext() {
    const chapter = this.nextChapter;
    if (!chapter) return null;

    try {
      await chapter.refreshData();
    } catch (getChapterError) {
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
