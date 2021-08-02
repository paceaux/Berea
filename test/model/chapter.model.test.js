const BibleService = require('../../src/bibleService');
const Bible = require('../../src/models/bible.model');
const Chapter = require('../../src/models/chapter.model');

const service = new BibleService('5ae573a324440896fabd2942943728a5', 1);
const bible = new Bible('06125adad2d5898a-01', service);
const chapterMock = {
  id: 'GEN.1',
  bookId: 'GEN',
  number: 1,
  reference: 'Genesis 1',
};

describe('Model: Chapter', () => {
  describe('constructor', () => {
    describe('default props', () => {
      const chapter = new Chapter({}, bible);
      it('has an id', () => {
        expect(chapter).toHaveProperty('id', '');
      });
      it('has empty data', () => {
        expect(chapter).toHaveProperty('data');
        expect(chapter.data).toMatchObject({});
      });
      it('has a service', () => {
        expect(chapter).toHaveProperty('bibleService');
        expect(chapter.bibleService).toBeInstanceOf(BibleService);
      });
    });
    describe('chapter Props', () => {
      const chapter = new Chapter(chapterMock, bible);
      it('has an id', () => {
        expect(chapter).toHaveProperty('id', chapterMock.id);
      });
      it('has a bookId', () => {
        expect(chapter).toHaveProperty('bookId', chapterMock.bookId);
      });
      it('has an number', () => {
        expect(chapter).toHaveProperty('number', chapterMock.number);
      });
      it('has a name', () => {
        expect(chapter).toHaveProperty('name', chapterMock.reference);
      });
      it('has a verseCount', () => {
        expect(chapter).toHaveProperty('verseCount', 0);
      });
      it('has a content', () => {
        expect(chapter).toHaveProperty('content', '');
      });
    });
  });
  describe('refreshData', () => {
    it(' will populate data', async () => {
      const chapter = new Chapter('GEN.1', bible);

      await chapter.refreshData();
      expect(chapter.data).toHaveProperty('bookId');
      expect(chapter.data).toHaveProperty('copyright');
      expect(chapter.data).toHaveProperty('verseCount');
      expect(chapter.data).toHaveProperty('previous');
      expect(chapter.data).toHaveProperty('next');
    });
    it('dynamic props will have info', async () => {
      const chapter = new Chapter('GEN.1', bible);

      await chapter.refreshData();
      expect(chapter.verseCount).toBeGreaterThan(0);
      expect(chapter.content.length).toBeGreaterThan(0);
      expect(chapter.data).toHaveProperty('verseCount');
    });
    it('verseCount length matches length of parsed Verses', async () => {
      const chapter = new Chapter('GEN.1', bible);

      await chapter.refreshData();
      expect(chapter.verseCount).toEqual(chapter.verseList.length);
    });
  });
  describe('verseList', () => {
    it(' will get an array', async () => {
      const chapter = new Chapter('GEN.1', bible);

      await chapter.refreshData();
      expect(chapter.verseList).toBeInstanceOf(Array);
      expect(typeof chapter.verseList[0]).toBe('string');
    });
  });
  describe('prev and next', () => {
    it('has empty prev and next at start', () => {
      const chapter = new Chapter('GEN.1', bible);
      expect(chapter.previousChapter).toBe(null);
      expect(chapter.nextChapter).toBe(null);
    });
    it('When refreshed, prev/next are of type Chapter', async () => {
      const chapter = new Chapter('GEN.1', bible);

      await chapter.refreshData();

      expect(chapter.previousChapter).toBeInstanceOf(Chapter);
      expect(chapter.nextChapter).toBeInstanceOf(Chapter);
    });
    it('gets full data with getNext', async () => {
      const chapter = new Chapter('GEN.1', bible);

      await chapter.refreshData();

      const next = await chapter.getNext();

      expect(next.content).toBeTruthy();
      expect(next.verseCount).toBeGreaterThan(0);
    });
    it('gets full data with getPrevious', async () => {
      const chapter = new Chapter('GEN.2', bible);

      await chapter.refreshData();

      const previous = await chapter.getPrevious();

      expect(previous.content).toBeTruthy();
      expect(previous.verseCount).toBeGreaterThan(0);
    });
  });
  describe('intro edge cases', () => {
    it('Intro chapter has a number of 0', async () => {
      const chapter = new Chapter('GEN.intro', bible);
      await chapter.refreshData();
      expect(chapter.number).toEqual(0);
    });

    it('intro chapter has verseList and verseCount of 0', async () => {
      const chapter = new Chapter('GEN.intro', bible);
      await chapter.refreshData();
      expect(chapter.verseList.length).toEqual(0);
      expect(chapter.verseCount).toEqual(0);
    });
    it('intro chapter', async () => {
      const chapter = new Chapter('GEN.intro', bible);
      await chapter.refreshData();
      expect(chapter.verseList.length).toEqual(0);
      expect(chapter.verseCount).toEqual(0);
    });
  });
  describe('search', () => {
    describe('it finds stuff only in the Chapter', () => {
      const chapter = new Chapter('GEN.1', bible);

      it('can search by string', async () => {
        const results = await chapter.search('Cain');

        expect(results).toBeInstanceOf(Object);
        expect(results.total).toEqual(0);
      });
      it('can search by object', async () => {
        const results = await chapter.search({
          query: 'Cain',
          limit: 25,
        });

        expect(results).toBeInstanceOf(Object);
        expect(results.total).toEqual(0);
        expect(results.verseCount).toEqual(0);
      });
    });
  });
});
