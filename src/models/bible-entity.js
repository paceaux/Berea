const Entity = require('./entity');
const Bible = require('./bible');

class BibleEntity extends Entity {
    bible = null;
    constructor(data, bible) {
        super(data, bible.bibleService);

        if (typeof bible === 'string') {
            this.bible = new Bible(bible, bibleService);
        } else {
            this.bible = bible;
        }
        
    }
}

module.exports = BibleEntity;