const BibleService = require('../bibleService');

class Entity {

    id = '';
    data = {};
    bibleService = new BibleService();

    /**
     * @param  {object|string} data full data object returned from api, or the id of a bible
     * @param  {BibleService|string} bibleService the BibleService, or the apikey that could be used to instantiate a service
     */
    constructor(data, bibleService ) {

        if (typeof data === 'string') {
            this.id = data;
        }

        if (typeof data === 'object') {
            if ('id' in data) this.id = data.id;
            this.data = data;
        }

        if (typeof bibleService === 'string') {
            this.bibleService = new BibleService(bibleService);
        }

        if (bibleService instanceof BibleService) {
            this.bibleService = bibleService;
        }
    }
}

module.exports = Entity;