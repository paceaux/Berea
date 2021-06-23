const BibleEntity = require('./bible-entity.model');
const Chapter = require('./chapter.model');

/**
 * @type {import('../bibleService').Passage}
 */
class Passage extends BibleEntity {
  /**
   * Name of book and chapter, or undefined if data not refreshed
   *
   * @type {string|undefined}
   */
  get name() {
    return this.data.reference;
  }

  /**
   * Id of the first verse in the passage
   *
   * @type {string}
   */
  get firstVerseId() {
    return Passage.parseId(this.id).firstVerseId;
  }

  /**
   * Id of the last verse in the passage
   *
   * @type {string}
   */
  get lastVerseId() {
    return Passage.parseId(this.id).lastVerseId;
  }

  /**
   * id for the book which contains this passage
   *
   * @type {string}
   */
  get bookId() {
    return Passage.parseId(this.id).bookId;
  }

  /**
   * ids for the chapters the passage spans
   *
   * @type {Array<string>}
   */
  get chapterIds() {
    return Passage.parseId(this.id).chapterIds;
  }

  /**
   * Chapters the passage spans
   *
   * @type {Array<string}
   */
  get chapters() {
    const { chapterIds, data } = this;
    const chapters = [];

    if (chapterIds && chapterIds.length > 0) {
      const { content } = data;
      const chapterContents = [];

      if (content) {
        chapterContents.push(...Passage.parseChapters(content));
      }

      const chapterObjects = chapterIds
        .map((chapterId, index) => {
          const chapter = new Chapter(chapterId, this.bible);
          const chapterContent = content && chapterContents[index];

          if (chapterContent) {
            chapter.data.content = chapterContents;
            const verses = Passage.parseVerses(chapterContent);
            chapter.data.verseCount = verses.length;
          }
          return chapter;
        });
      chapters.push(...chapterObjects);
    }
    return chapters;
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
      verses.push(...Passage.parseVerses(this.data.content));
    }
    return verses;
  }

  /**
   * Trimmed raw content from API if data has been refreshed or loaded
   *
   * @type {string}
   */
  get content() {
    return Passage.cleanContent(this.data.content);
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
