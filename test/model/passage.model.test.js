const BibleService = require('../../src/bibleService');
const Bible = require('../../src/models/bible.model');
const Chapter = require('../../src/models/chapter.model');
const Passage = require('../../src/models/passage.model');

const service = new BibleService('5ae573a324440896fabd2942943728a5', 1);
const bible = new Bible('06125adad2d5898a-01', service);
const passageMock = {
  id: 'GEN.1.1-GEN.4.20',
  orgId: 'GEN.1.1-GEN.4.20',
  bibleId: '06125adad2d5898a-01',
  bookId: 'GEN',
};

describe('Model: Passage', () => {
  describe('constructor', () => {
    describe('default props', () => {
      const passage = new Passage({}, bible);
      it('has an id', () => {
        expect(passage).toHaveProperty('id', '');
      });
      it('has empty data', () => {
        expect(passage).toHaveProperty('data');
        expect(passage.data).toMatchObject({});
      });
      it('has a service', () => {
        expect(passage).toHaveProperty('bibleService');
        expect(passage.bibleService).toBeInstanceOf(BibleService);
      });
    });
    describe('passage Props', () => {
      const passage = new Passage(passageMock, bible);
      it('has an id', () => {
        expect(passage).toHaveProperty('id', passageMock.id);
      });
      it('has a name', () => {
        expect(passage).toHaveProperty('name', passageMock.reference);
      });
      it('has a startVerseid', () => {
        expect(passage).toHaveProperty('firstVerseId', 'GEN.1.1');
      });
      it('has an  endVerseId', () => {
        expect(passage).toHaveProperty('lastVerseId', 'GEN.4.20');
      });
      it('has a bookId', () => {
        expect(passage).toHaveProperty('bookId', passageMock.bookId);
      });
      it('has chapterIds', () => {
        expect(passage).toHaveProperty('chapterIds');
        expect(passage.chapterIds).toEqual(expect.arrayContaining(['GEN.1', 'GEN.2', 'GEN.3', 'GEN.4']))
      });
      it('has verseCount', () => {
        expect(passage).toHaveProperty('verseCount');
      });
      it('has a content', () => {
        expect(passage).toHaveProperty('content');
      });
    });
  });
  describe('refreshData', () => {
    it(' will populate data', async () => {
      const passage = new Passage('GEN.1.1-GEN.4.20', bible);

      await passage.refreshData();
      expect(passage.data).toHaveProperty('bookId');
      expect(passage.data).toHaveProperty('copyright');
      expect(passage.data).toHaveProperty('verseCount', 100);
    });
    it('dynamic props will have info', async () => {
      const passage = new Passage('GEN.1.1-GEN.4.20', bible);

      await passage.refreshData();
      expect(passage.content.length).toBeGreaterThan(0);
      expect(passage.data.copyright.length).toBeGreaterThan(0);
    });
    it('will have a property containing chapter objects', async () => {
      const passage = new Passage('GEN.1.1-GEN.4.20', bible);

      await passage.refreshData();
      expect(passage.chapters).toBeInstanceOf(Array);
      expect(passage.chapters.length).toBeGreaterThan(0);
      expect(passage.chapters[0]).toBeInstanceOf(Chapter);
    });
    it('will have verse content in its chapter objects', async () => {
      const passage = new Passage('GEN.1.1-GEN.4.20', bible);

      await passage.refreshData();

      const [firstChapter] = passage.chapters;

      expect(firstChapter).toHaveProperty('data');
      expect(firstChapter.data).toHaveProperty('content');
      expect(firstChapter.data).toHaveProperty('verseCount');
    });
  });
  describe('search', () => {
    describe('it finds stuff only in the Chapter', () => {
      const book = new Passage('GEN.1.1-GEN.4.20', bible);

      it('can search by string', async () => {
        const results = await book.search('Cain');

        expect(results).toBeInstanceOf(Object);
        expect(results.total).toEqual(11);
      });
    });
  });
});
