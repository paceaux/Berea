const BibleService = require('../../src/bibleService');
const Bible = require('../../src/models/bible.model');
const Book = require('../../src/models/book.model');
const Chapter = require('../../src/models/chapter.model');


const service = new BibleService('5ae573a324440896fabd2942943728a5', 1);
const bible = new Bible('06125adad2d5898a-01', service);
const bookMock = {
        "id": "GEN",
        "bibleId": "06125adad2d5898a-01",
        "abbreviation": "Gen.",
        "name": "Genesis",
        "nameLong": "The First Book of Moses, Commonly Called Genesis"
};


describe('Model: Book', () => {
    describe('constructor', () => {
        describe('default props', () => {
            const book = new Book({},bible);
            it('has an id', () => {
                expect(book).toHaveProperty('id', '');
            }); 
            it('has empty data', () => {
                expect(book).toHaveProperty('data');
                expect(book.data).toMatchObject({});
            }); 
            it('has a service', () => {
                expect(book).toHaveProperty('bibleService');
                expect(book.bibleService).toBeInstanceOf(BibleService);
            });
        });
        describe('book Props', () => {
            const book = new Book(bookMock,bible);
            it('has an name', () => {
                expect(book).toHaveProperty('name', bookMock.name);
            }); 
            it('has a longname', () => {
                expect(book).toHaveProperty('longName', bookMock.nameLong);
            }); 
            it('has an abbreviation', () => {
                expect(book).toHaveProperty('abbreviation', bookMock.abbreviation);
            }); 
            it('has an id', () => {
                expect(book).toHaveProperty('id', bookMock.id);
            }); 
        });
    });
    describe('refreshData', () => {
        it(' will populate data', async () => {
            const book = new Book('GEN', bible);

            await book.refreshData();
            expect(book.data).toHaveProperty('bibleId');
        });
    });
    describe('getChapters', () => {
        it(' will get an array', async () => {
            const book = new Book(bookMock, bible);

            const chapters = await book.getChapters();
            expect(chapters).toBeInstanceOf(Array);
            expect(chapters.length).toBeGreaterThan(10);
        });
        it(' will get an array of Chapters', async () => {
            const book = new Book(bookMock, bible);

            const chapters = await book.getChapters();
            expect(chapters[0]).toBeInstanceOf(Chapter);

        });
    });
});