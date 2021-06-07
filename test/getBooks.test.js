const BibleApi = require('../src/bibleService');;

describe('getBooks', () => {
    const api = new BibleApi('5ae573a324440896fabd2942943728a5', 1);

    it('can get books if the id is a string', async () => {
        const result = await api.getBooks('06125adad2d5898a-01');

        expect(result).toBeInstanceOf(Object);
    });
    it('can get books if the id is in an object', async () => {
        const result = await api.getBooks({id: '06125adad2d5898a-01'});

        expect(result).toBeInstanceOf(Object);
        expect(result.length).toBeGreaterThanOrEqual(60);
        expect(result[1]).toHaveProperty('name', 'Exodus')
    });
});

describe('getBook', () => {
    const api = new BibleApi('5ae573a324440896fabd2942943728a5', 1);

    it ('gets a book when sent a single object', async () => {
        const result = await api.getBook({id: '06125adad2d5898a-01', bookId: 'EXO'});

        expect(result).toBeInstanceOf(Object);
        expect(result).toHaveProperty('name', 'Exodus')

    })
    it('gets a book when sent two strings', async () => {
        const result = await api.getBook('06125adad2d5898a-01', 'EXO');

        expect(result).toBeInstanceOf(Object);
        expect(result).toHaveProperty('name', 'Exodus')

    })
    it('gets an error if a second parameter isn\'t provided and the first is a string', async () => {
        try {
             await api.getBook('06125adad2d5898a-01');
        } catch (error) {
            expect(error.message).toEqual('bibleId provided as string without bookId as second parameter');
        }

    })
})