const Entity = require('../../src/models/entity.model');

describe('Model: Bible-entity', () => {
  describe('static methods', () => {
    describe('parseVerseId', () => {
      it('can return 3 values from a full id', () => {
        const idObject = Entity.parseVerseId('GEN.1.1');

        expect(idObject).toHaveProperty('bookId', 'GEN');
        expect(idObject).toHaveProperty('chapterId', 'GEN.1');
        expect(idObject).toHaveProperty('verseId', 'GEN.1.1');
      });
      it('returns 2 values with just book and chapter', () => {
        const idObject = Entity.parseVerseId('GEN.1');

        expect(idObject).toHaveProperty('bookId', 'GEN');
        expect(idObject).toHaveProperty('chapterId', 'GEN.1');
        expect(idObject).not.toHaveProperty('verseId');
      });
      it('returns 1 value with just book ', () => {
        const idObject = Entity.parseVerseId('GEN');

        expect(idObject).toHaveProperty('bookId', 'GEN');
        expect(idObject).not.toHaveProperty('chapterId');
        expect(idObject).not.toHaveProperty('verseId');
      });
    });
    describe('fillChapterIds', () => {
      it('can fill ids from a range of numbers', () => {
        const chapterIds = Entity.fillChapterIds(1, 4, 'GEN');

        expect(chapterIds).toEqual(expect.arrayContaining(['GEN.1', 'GEN.2', 'GEN.3', 'GEN.4']));
      });
    });
    describe('parseId', () => {
      it('gives ONLY values for a verse', () => {
        const idObject = Entity.parseId('GEN.1.1');

        expect(idObject).toHaveProperty('bookId', 'GEN');
        expect(idObject).toHaveProperty('chapterId', 'GEN.1');
        expect(idObject).toHaveProperty('verseId', 'GEN.1.1');
        expect(idObject).not.toHaveProperty('chapters');
        expect(idObject).not.toHaveProperty('firstVerseId');
        expect(idObject).not.toHaveProperty('lastVerseId');
      });
      it('gives first and last verseIds for a passage', () => {
        const idObject = Entity.parseId('GEN.1.1-GEN.2.10');

        expect(idObject).toHaveProperty('bookId', 'GEN');

        expect(idObject).toHaveProperty('firstVerseId', 'GEN.1.1');
        expect(idObject).toHaveProperty('lastVerseId', 'GEN.2.10');
      });
      it('gives chapterIds as an Array for a passage', () => {
        const idObject = Entity.parseId('GEN.1.1-GEN.2.10');

        console.log(idObject);
        expect(idObject).toHaveProperty('bookId', 'GEN');

        expect(idObject).toHaveProperty('chapterIds', ['GEN.1', 'GEN.2']);
      });
    });
  });
});
