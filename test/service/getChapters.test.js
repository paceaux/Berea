const BibleApi = require('../../src/bibleService');

describe('getChapters', () => {
  const api = new BibleApi('5ae573a324440896fabd2942943728a5', 1);

  describe('getChaptersFromBook', () => {
    it('gets chapters when sent two strings', async () => {
      const result = await api.getChaptersFromBook('c315fa9f71d4af3a-01', 'EXO');

      expect(result).toBeInstanceOf(Object);
      expect(result.length).toBeGreaterThanOrEqual(20);
      expect(result[1].reference).toEqual('Exodus 1');
    });
    it('gets chapters when sent a single object', async () => {
      const result = await api.getChaptersFromBook({ id: 'c315fa9f71d4af3a-01', bookId: 'EXO' });

      expect(result).toBeInstanceOf(Object);
      expect(result.length).toBeGreaterThanOrEqual(20);
      expect(result[1].reference).toEqual('Exodus 1');
    });
    it('throws an error when sent one string', async () => {
      try {
        await api.getChaptersFromBook('c315fa9f71d4af3a-01');
      } catch (error) {
        expect(error.message).toEqual('bibleId provided as string without bookId as second parameter');
      }
    });
  });

  describe('getChapter', () => {
    it('gets a chapter when sent two strings', async () => {
      const result = await api.getChapter('c315fa9f71d4af3a-01', 'EXO.1');

      expect(result).toBeInstanceOf(Object);
      expect(result.reference).toEqual('Exodus 1');
    });
    it('gets chapter when sent a single object', async () => {
      const result = await api.getChapter({ id: 'c315fa9f71d4af3a-01', chapterId: 'EXO.1' });

      expect(result).toBeInstanceOf(Object);
      expect(result.reference).toEqual('Exodus 1');
    });
    it('gets chapter and changes contentType to JSON ', async () => {
      const result = await api.getChapter({ id: 'c315fa9f71d4af3a-01', chapterId: 'EXO.1', contentType: 'json' });

      expect(result).toBeInstanceOf(Object);
      expect(result.reference).toEqual('Exodus 1');
      expect(result.content).toBeInstanceOf(Object);
    });
    it('throws an error when sent one string', async () => {
      try {
        await api.getChapter('c315fa9f71d4af3a-01');
      } catch (error) {
        expect(error.message).toEqual('bibleId provided as string without chapterId as second parameter');
      }
    });
  });
});
