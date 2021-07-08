const BibleApi = require('../../src/bibleService');

describe('search', () => {
  const api = new BibleApi('5ae573a324440896fabd2942943728a5', 1);

  describe('basic search', () => {
    it('gets a verse when sent two strings', async () => {
      const result = await api.search('c315fa9f71d4af3a-01', 'Adam');

      expect(result).toBeInstanceOf(Object);
      expect(result.query).toEqual('Adam');
    });
    it('gets verse when sent a single object', async () => {
      const result = await api.search({ id: 'c315fa9f71d4af3a-01', query: 'Adam' });
      expect(result).toBeInstanceOf(Object);
      expect(result.query).toEqual('Adam');
    });
    it('throws an error when sent one string', async () => {
      try {
        await api.search('c315fa9f71d4af3a-01');
      } catch (error) {
        expect(error.message).toEqual('bibleId provided as string without query as second parameter');
      }
    });
  });
  describe('advanced search', () => {
    it('allows a limit', async () => {
      const result = await api.search({ id: 'c315fa9f71d4af3a-01', query: 'Adam', limit: 5 });

      expect(result).toBeInstanceOf(Object);
      expect(result.query).toEqual('Adam');
      expect(result.verseCount).toEqual(5);
    });
    it('allows a sort', async () => {
      const result = await api.search({ id: 'c315fa9f71d4af3a-01', query: 'Adam', sort: 'reverse-canonical' });

      expect(result).toBeInstanceOf(Object);
      expect(result.query).toEqual('Adam');
      expect(result.verses[0].bookId).toEqual('JUD');
    });
    it('allows a range', async () => {
      const result = await api.search(
        {
          id: 'c315fa9f71d4af3a-01',
          query: 'Adam',
          range: 'GEN',
          limit: 50,
        },
      );

      expect(result).toBeInstanceOf(Object);
      expect(result.query).toEqual('Adam');
      expect(result.total).toEqual(17);
    });
    it('allows 1-letter aliases', async () => {
      const result = await api.search(
        {
          id: 'c315fa9f71d4af3a-01',
          q: 'Adam',
          r: 'GEN',
          l: 50,
        },
      );

      expect(result).toBeInstanceOf(Object);
      expect(result.query).toEqual('Adam');
      expect(result.total).toEqual(17);
    });
    it('allows other word aliases', async () => {
      const result = await api.search(
        {
          id: 'c315fa9f71d4af3a-01',
          q: 'Adam',
          passage: 'GEN',
          l: 50,
        },
      );

      expect(result).toBeInstanceOf(Object);
      expect(result.query).toEqual('Adam');
      expect(result.total).toEqual(17);
    });
  });
});
