const BibleApi = require('../index');


describe('getPassage', () => {
    const api = new BibleApi('5ae573a324440896fabd2942943728a5', 1);

    describe('getPassage', () => {
        it('gets passages when sent two strings', async () => {
            const result = await api.getPassage('c315fa9f71d4af3a-01', 'EXO.1.1-EXO.2.10');
            
            expect(result).toBeInstanceOf(Object);
        });
        it('gets passages when sent a single object', async () => {
            const result = await api.getPassage({id: 'c315fa9f71d4af3a-01', passageId: 'EXO.1.1-EXO.2.10'});
            
            expect(result).toBeInstanceOf(Object);

        });
        it('throws an error when sent one string', async () =>{
            try {
                await api.getPassage('c315fa9f71d4af3a-01');
            } catch (error) {
                expect(error.message).toEqual('bibleId provided as string without passageId as second parameter')
            }
        })
    });
});