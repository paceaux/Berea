const BibleApi = require('../index');


describe('getBibles', () => {
        const api = new BibleApi('5ae573a324440896fabd2942943728a5', 1);

    it('it gets a hugeass list of bibles', async () => {
        const result = await api.getBibles();

        expect(result).toBeInstanceOf(Object);
        expect(result.length).toBeGreaterThan(10);
    });

    it('it can get with a config, by language', async () => {
        const [result] = await api.getBibles({
            language: 'eng'
        });

        expect(result).toBeInstanceOf(Object);
        expect(result).toHaveProperty('language');
        expect(result.language).toHaveProperty('id', 'eng');
    });

    it('it can get with config by abbreviation', async () => {
        const [result] = await api.getBibles({
            abbreviation: 'asv'
        });

        expect(result).toBeInstanceOf(Object);
        expect(result).toHaveProperty('abbreviation', 'ASVBT');
    });
});
describe('getBibleById', () => {
    const api = new BibleApi('5ae573a324440896fabd2942943728a5', 1);

    it('can get by an Id', async () => {
        const result = await api.getBible('06125adad2d5898a-01');

        expect(result).toBeInstanceOf(Object);
        expect(result).toHaveProperty('id', '06125adad2d5898a-01');
    });
    it('throws an error if no id is provided', async () => {
        try {
            await api.getBible('');
        } catch (error) {
            expect(error.message).toEqual('id must be provided');
        }


    });
});