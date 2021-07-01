const BibleEntity = require('./bible-entity.model');
const Chapter = require('./chapter.model');

/**
 * @type {import('../bibleService').Verse}
 */
class Verse extends BibleEntity {
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
    return Verse.parseVerseId(this.id).bookId;
  }

  /**
   * id for the chapter which contains this chapter
   *
   * @type {string}
   */
  get chapterId() {
    return Verse.parseId(this.id).chapterId;
  }

  /**
   * chapter number. Intros will return 0
   *
   * @type {number}
   */
  get number() {
    return Verse.parseId(this.id).verseNumber;
  }

  /**
   * Chapter that contains the verse
   *
   * @type {Chapter} Shallow-populated chapter object
   */
  get chapter() {
    const { chapterId } = this;
    let chapter = null;

    if (chapterId) {
      chapter = new Chapter(chapterId, this.bibleService);
    }
    return chapter;
  }

  /**
   * Trimmed raw content from API if data has been refreshed or loaded
   *
   * @type {string}
   */
  get content() {
    const strContent = this.data.content;
    const { number } = this;
    let content = '';

    if (strContent) {
      content = strContent
        .replace(`[${number}]`, '')
        .trim();
    }

    return content;
  }

  /**
   * The previous verse in the chapter, or null if data is not refreshed/loaded
   *
   * @type {Chapter|null}
   */
  get previousVerse() {
    let verse = null;
    const { data: { previous } } = this;

    if (previous && previous.id) {
      verse = new Verse(previous.id, this.bible);
    }
    return verse;
  }

  /**
   * The next verse in the chapter, or null if data is not refreshed/loaded
   *
   * @type {Chapter|null}
   */
  get nextVerse() {
    let verse = null;
    const { data: { next } } = this;

    if (next && next.id) {
      verse = new Verse(next.id, this.bible);
    }
    return verse;
  }

  /**
   * gets previous verse in the book
   *
   * @returns {Verse|null} preceding verse in chapter
   */
  async getPrevious() {
    const verse = this.previousVerse;
    if (!verse) return null;

    try {
      await verse.refreshData();
    } catch (getVerseError) {
      // this doesn't return. Want to surface the error somehow
      // eslint-disable-next-line no-console
      console.error(getVerseError);
    }

    return verse;
  }

  /**
   * gets next verse in the book
   *
   * @returns {Verse|null} succeeding verse in chapter
   */
  async getNext() {
    const verse = this.nextVerse;
    if (!verse) return null;

    try {
      await verse.refreshData();
    } catch (getVerseError) {
      // this doesn't return. Want to surface the error somehow
      // eslint-disable-next-line no-console
      console.error(getVerseError);
    }

    return verse;
  }

  /**
   * Populates data if constructed with a string, or retrieves data not present at instantiation
   * This will load the content, verses, and previous/nextChapters properties
   *
   * @returns {Promise<void>}
   */
  async refreshData() {
    const data = await this.bibleService.getVerse({
      contentType: 'text',
      id: this.bible.id,
      verseId: this.id,
    });

    this.data = data;
  }
}

module.exports = Verse;
