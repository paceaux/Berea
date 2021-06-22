const BibleEntity = require('./bible-entity.model');
const Chapter = require('./chapter.model');

/**
 * @type {import('../bibleService').Passage}
 */
class Passage extends BibleEntity {
  /** Name of book and chapter, or undefined if data not refreshed
     * @type {string|undefined}
     */
  get name() {
    return this.data.reference;
  }

  /** Id of the first verse in the passage
     * @type {string}
     */
  get firstVerseId() {
    const [start] = this.id.split('-');

    return start;
  }

  /** Id of the last verse in the passage
     * @type {string}
     */
  get lastVerseId() {
    const [, last] = this.id.split('-');

    return last;
  }

  /** id for the book which contains this passage
     * @type {string}
     */
  get bookId() {
    const [book] = this.id.split('.');
    return `${book}`;
  }

  /** ids for the chapters the passage spans
     * @type {Array<string>}
     */
  get chapterIds() {
    const { firstVerseId, lastVerseId, bookId } = this;
    const firstChapterNum = parseInt(firstVerseId.split('.')[1], 10);
    const lastChapterNum = parseInt(lastVerseId.split('.')[1], 10);
    const chapterNumbers = [firstChapterNum, lastChapterNum];

    while (chapterNumbers[chapterNumbers.length - 1] - 1 !== chapterNumbers[chapterNumbers.length - 2]) {
      chapterNumbers.splice(chapterNumbers.length - 1, 0, chapterNumbers[chapterNumbers.length - 2] + 1);
    }

    return chapterNumbers
      .map((chapterNumber) => `${bookId}.${chapterNumber}`);
  }

  /** Chapters the passage spans
   * @type {Array<string}
   */
  get chapters() {
    const { chapterIds, data } = this;
    const chapters = [];
    const chapterRegex = new RegExp(/\s(?=\[1\])/);
    const verseRegex = new RegExp(/(?:\[[0-9]+\]\s)/);

    if (chapterIds && chapterIds.length) {
      const { content } = data;
      const chapterContents = [];

      if (content) {
        const chaptersSplitByRegex = content.split(chapterRegex);
        const chapterArray = chaptersSplitByRegex.map((chapterText) => chapterText.trim().replace('\n', ''));
        chapterContents.push(...chapterArray.filter((el) => el));
      }

      const chapterObjects = chapterIds
        .map((chapterId, index) => {
          const chapter = new Chapter(chapterId, this.bible);
          const chapterContent = content && chapterContents[index];

          if (chapterContent) {
            chapter.data.content = chapterContents;
            const verseSplit = chapterContent.split(verseRegex);
            const verseArray = verseSplit.map((verse) => verse.trim().replace('\n', ''));
            const verses = verseArray.filter((el) => el);
            chapter.data.verseCount = verses.length;
          }
          return chapter;
        });
      chapters.push(...chapterObjects);
    }
    return chapters;
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

  /**
     * Populates data if constructed with a string, or retrieves data not present at instantiation
     * This will load the content, verses, and previous/nextChapters properties
     *
     * @returns {Promise<void>}
     */
  async refreshData() {
    const data = await this.bibleService.getPassage(
      {
        contentType: 'text',
        id: this.bible.id,
        passageId: this.id,
      },
    );
    this.data = data;
  }
}

module.exports = Passage;
