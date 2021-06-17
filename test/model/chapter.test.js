const BibleService = require('../../src/bibleService');
const Bible = require('../../src/models/bible');
const Chapter = require('../../src/models/chapter');


const service = new BibleService('5ae573a324440896fabd2942943728a5', 1);
const bible = new Bible('06125adad2d5898a-01', service);
const chapterMock = {
        "id": "GEN.1",
        "bookId": "GEN",
        "number": "1",
        "reference": "Genesis 1",
};


describe('Model: Chapter', () => {
    describe('constructor', () => {
        describe('default props', () => {
            const chapter = new Chapter({},bible);
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
            const chapter = new Chapter(chapterMock,bible);
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
                expect(chapter).toHaveProperty('content', {});
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
    });
    describe.skip('getChapters', () => {
        it(' will get an array', async () => {
            const chapter = new Chapter(bookMock, bible);

            const chapters = await chapter.getChapters();
            expect(chapters).toBeInstanceOf(Array);
            expect(chapters.length).toBeGreaterThan(10);
        });
        it(' will get an array of Chapters', async () => {
            const book = new Chapter(bookMock, bible);

            const chapters = await book.getChapters();
            expect(chapters[0]).toBeInstanceOf(Chapter);

        });
    });
});