const BibleApi = require('../index');


describe('getVerses', () => {
    const api = new BibleApi('5ae573a324440896fabd2942943728a5', 1);

    describe('getVersesFromChapter', () => {
        it('gets chapters when sent two strings', async () => {
            const result = await api.getVersesFromChapter('c315fa9f71d4af3a-01', 'EXO.1');
            
            expect(result).toBeInstanceOf(Object);

            
        });
        it('gets chapters when sent a single object', async () => {
            const result = await api.getVersesFromChapter({id: 'c315fa9f71d4af3a-01', chapterId: 'EXO.1'});
            
            expect(result).toBeInstanceOf(Object);

        });
        it('throws an error when sent one string', async () =>{
            try {
                await api.getVersesFromChapter('c315fa9f71d4af3a-01');
            } catch (error) {
                expect(error.message).toEqual('bibleId provided as string without chapterId as second parameter')
            }
        })
    });
    describe('getVerse', () => {
        it('gets a verse when sent two strings', async () => {
            const result = await api.getVerse('c315fa9f71d4af3a-01', 'EXO.1.1');
            
            expect(result).toBeInstanceOf(Object);
            expect(result.reference).toEqual('Exodus 1:1')
            
        });
        it('gets verse when sent a single object', async () => {
            const result = await api.getVerse({id: 'c315fa9f71d4af3a-01', verseId: 'EXO.1.1'});
            
            expect(result).toBeInstanceOf(Object);
            expect(result.reference).toEqual('Exodus 1:1')

        });
        it('gets verse and changes contentType to JSON ', async () => {
            const result = await api.getVerse({id: 'c315fa9f71d4af3a-01', verseId: 'EXO.1.1', contentType: 'json'});
            
            expect(result).toBeInstanceOf(Object);
            expect(result.reference).toEqual('Exodus 1:1')
            expect(result.content).toBeInstanceOf(Object);

        });
        it('throws an error when sent one string', async () =>{
            try {
                await api.getVerse('c315fa9f71d4af3a-01');
            } catch (error) {
                expect(error.message).toEqual('bibleId provided as string without verseId as second parameter')
            }
        })
    });
});