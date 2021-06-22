const BibleService = require('../bibleService');

class Entity {
    id = '';

    data = {};

    bibleService = new BibleService();

    /**
     * @param  {object|string} data full data object returned from api, or the id of a bible
     * @param  {BibleService|string} bibleService the BibleService, or the apikey that could be used to instantiate a service
     */
    constructor(data, bibleService) {
      if (typeof data === 'string') {
        this.id = data;
      }

      if (typeof data === 'object') {
        if ('id' in data) this.id = data.id;
        this.data = data;
      }

      if (typeof bibleService === 'string') {
        this.bibleService = new BibleService(bibleService);
      }

      if (bibleService instanceof BibleService) {
        this.bibleService = bibleService;
      }
    }

    static parseVerseId(idString) {
      const [book, chapterNum, verseNum] = idString.split('.');

      const bookId = book;
      const chapterId = chapterNum && `${book}.${chapterNum}`;
      const verseId = verseNum && idString;

      const result = {
        bookId,
      };

      if (chapterNum) {
        const chapterNumber = parseInt(chapterNum, 10);
        result.chapterId = chapterId;
        result.chapterNumber = Number.isNaN(chapterNumber) ? 0 : chapterNumber;
      }

      if (verseNum) {
        const verseNumber = parseInt(verseNum, 10);
        result.verseId = verseId;
        result.verseNumber = Number.isNaN(verseNumber) ? 0 : verseNumber;
      }

      return result;
    }

    static fillChapterIds(firstChapterNum, lastChapterNum, bookId) {
      const chapterNumbers = [firstChapterNum, lastChapterNum];

      while (chapterNumbers[chapterNumbers.length - 1] - 1 !== chapterNumbers[chapterNumbers.length - 2]) {
        chapterNumbers.splice(chapterNumbers.length - 1, 0, chapterNumbers[chapterNumbers.length - 2] + 1);
      }

      const chapterIds = chapterNumbers
        .map((chapterNumber) => `${bookId}.${chapterNumber}`);

      return chapterIds;
    }

    static parseId(idString) {
      const [firstVerseId, lastVerseId] = idString.split('-');

      const firstVerseParsedId = Entity.parseVerseId(firstVerseId);
      const { bookId } = firstVerseParsedId;

      let result = {
        bookId,
      };

      if (lastVerseId) {
        const { chapterNumber: lastChapterNum } = Entity.parseVerseId(lastVerseId);
        const { chapterNumber: firstChapterNum } = firstVerseParsedId;
        const chapterIds = Entity.fillChapterIds(firstChapterNum, lastChapterNum, bookId);

        result.lastVerseId = lastVerseId;
        result.firstVerseId = firstVerseId;
        result.chapterIds = chapterIds;
      } else {
        result = { ...firstVerseParsedId };
      }

      return result;
    }

    static cleanContent(strContent) {
      let content = '';

      if (strContent) {
        content = strContent.trim();
      }

      return content;
    }

    static parseVerses(content) {
      const verses = [];

      if (typeof content === 'string') {
        const splitRegex = new RegExp(/(?:\[[0-9]+\]\s)/);
        const verseSplit = content.split(splitRegex);
        const verseArray = verseSplit.map((verse) => verse.trim().replace('\n', ''));
        verses.push(...verseArray.filter((el) => el));
      }
      return verses;
    }
}

module.exports = Entity;
