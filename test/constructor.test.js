const BibleApi = require('../index');


describe('prototype', () => {
    it('has BibleRoutes', () => {
        expect(BibleApi).toHaveProperty('BibleRoutes');
    })
    it('has GetParameters', () => {
        expect(BibleApi).toHaveProperty('GetParameters');
    });
})
describe('constructor', () => {
    it('applies an api key', () => {
        const api = new BibleApi('5ae573a324440896fabd2942943728a5');
        expect(api).toHaveProperty('apikey', '5ae573a324440896fabd2942943728a5');
    });
    describe('medium', () => {
        it('has a default of text', () => {
            const api = new BibleApi('5ae573a324440896fabd2942943728a5', 1);
            expect(api).toHaveProperty('medium', 'text');
        });

        it('can be set to audio', () => {
            const api = new BibleApi('5ae573a324440896fabd2942943728a5', 1, 'audio');
            expect(api).toHaveProperty('medium', 'audio');
        });
    })
    describe('baseRoute', () => {
        it('when the medium is text, the baseRoute is bibles', () => {
            const api = new BibleApi('5ae573a324440896fabd2942943728a5', 1);
            expect(api).toHaveProperty('medium', 'text');
            expect(api).toHaveProperty('baseRoute', 'bibles');
        });

        it('when the medium is audio, the baseRoute is audio-bibles', () => {
            const api = new BibleApi('5ae573a324440896fabd2942943728a5', 1, 'audio');
            expect(api).toHaveProperty('medium', 'audio');
            expect(api).toHaveProperty('baseRoute', 'audio-bibles');
        });
    })
        
    describe('has a version', () => {
        it('has a default version', () => {
            const api = new BibleApi('5ae573a324440896fabd2942943728a5');
            expect(api).toHaveProperty('version', 1);
        })
        it('has can set a version', () => {
            const api = new BibleApi('5ae573a324440896fabd2942943728a5', 2);
            expect(api).toHaveProperty('version', 2);
        });
    });
    describe('has dependencies', () => {
        it('has default dependencies', () => {
            const api = new BibleApi('5ae573a324440896fabd2942943728a5', 2);
            expect(api).toHaveProperty('dependencies');
            expect(api.dependencies).toBeInstanceOf(Object);
        });
        it('has axios in dependencies by default', () => {
            const api = new BibleApi('5ae573a324440896fabd2942943728a5', 2);
            expect(api.dependencies).toHaveProperty('Axios');
            expect(api.dependencies.Axios).toBeInstanceOf(Object);
        });
    });
    describe('has an axios object', () => {
        it('it has an axios object', () => {
            const api = new BibleApi('5ae573a324440896fabd2942943728a5', 1);
            expect(api).toHaveProperty('axios');
            expect(api.axios).toBeInstanceOf(Object);
            expect(api.axios.defaults.headers).toHaveProperty('api-key', '5ae573a324440896fabd2942943728a5');
            expect(api.axios.defaults).toHaveProperty('baseURL', 'https://api.scripture.api.bible/v1');
        });
    });
});