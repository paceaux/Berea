const BibleService = require('../../src/bibleService');
const Bible = require('../../src/models/bible.model');
const Chapter = require('../../src/models/chapter.model');
const Verse = require('../../src/models/verse.model');

const service = new BibleService('5ae573a324440896fabd2942943728a5', 1);
const bible = new Bible('06125adad2d5898a-01', service);
const verseMock = {
  id: 'GEN.1.1',
  bookId: 'GEN',
  chapterId: 'GEN.1',
  reference: 'Genesis 1:1',
  content: '     [1] In the beginning God created the heavens and the earth. \n',
};

describe('Model: Verse', () => {
  describe('constructor', () => {
    describe('default props', () => {
      const verse = new Verse({}, bible);
      it('has an id', () => {
        expect(verse).toHaveProperty('id', '');
      });
      it('has empty data', () => {
        expect(verse).toHaveProperty('data');
        expect(verse.data).toMatchObject({});
      });
      it('has a service', () => {
        expect(verse).toHaveProperty('bibleService');
        expect(verse.bibleService).toBeInstanceOf(BibleService);
      });
    });
    describe('verse Props', () => {
      const verse = new Verse(verseMock, bible);
      it('has an id', () => {
        expect(verse).toHaveProperty('id', verseMock.id);
      });
      it('has a number', () => {
        expect(verse).toHaveProperty('number', 1);
      });
      it('has a chapterId', () => {
        expect(verse).toHaveProperty('chapterId', verseMock.chapterId);
      });
      it('has a bookId', () => {
        expect(verse).toHaveProperty('bookId', verseMock.bookId);
      });
      it('has a name', () => {
        expect(verse).toHaveProperty('name', verseMock.reference);
      });
      it('has a content', () => {
        expect(verse).toHaveProperty('content');
      });
      it('verse content doesn\'t have the verse number in it', async () => {
        expect(verse.content).toEqual(expect.not.stringContaining('[1]'));
      });
    });
  });
  describe('refreshData', () => {
    it(' will populate data', async () => {
      const verse = new Verse('GEN.1.1', bible);

      await verse.refreshData();
      expect(verse.data).toHaveProperty('bookId');
      expect(verse.data).toHaveProperty('copyright');
      expect(verse.data).toHaveProperty('previous');
      expect(verse.data).toHaveProperty('next');
    });
    it('dynamic props will have info', async () => {
      const verse = new Verse('GEN.1.1', bible);

      await verse.refreshData();
      expect(verse.content.length).toBeGreaterThan(0);
      expect(verse.data.copyright.length).toBeGreaterThan(0);
    });
  });
  describe('prev and next', () => {
    it('has empty prev and next at start', () => {
      const verse = new Verse('GEN.1.1', bible);
      expect(verse.previousVerse).toBe(null);
      expect(verse.nextVerse).toBe(null);
    });
    it('When refreshed, prev/next are of type Verse', async () => {
      const verse = new Verse('GEN.1.1', bible);

      await verse.refreshData();

      expect(verse.previousVerse).toBeInstanceOf(Verse);
      expect(verse.nextVerse).toBeInstanceOf(Verse);
    });
    it('gets full data with getNext', async () => {
      const verse = new Verse('GEN.1.1', bible);

      await verse.refreshData();

      const next = await verse.getNext();

      expect(next.content).toBeTruthy();
    });
    it('gets full data with getPrevious', async () => {
      const verse = new Verse('GEN.1.2', bible);

      await verse.refreshData();

      const previous = await verse.getPrevious();

      expect(previous.content).toBeTruthy();
    });
  });
  describe('intro edge cases', () => {
    it('Intro verse has a number of 0', async () => {
      const verse = new Verse('GEN.intro.0', bible);
      await verse.refreshData();

      expect(verse.number).toEqual(0);
    });
    it('previous verse does not exist', async () => {
      const chapter = new Verse('GEN.intro.0', bible);
      await chapter.refreshData();
      expect(chapter.previousVerse).toBeNull();
    });
  });
});
