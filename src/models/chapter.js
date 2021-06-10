const BibleEntity = require('./bible-entity');


class Chapter extends BibleEntity {
    constructor(data, bible) {
        super(data, bible);

    }
    get name() {
        return this.data.name;
    }

    get longName() {
        return this.data.nameLong;
    }

    get abbreviation() {
        return this.data.abbreviation;
    }

    async refreshData() {
        const data = await this.bibleService.getChapter(this.id);
        this.data = data;
    }

}

module.exports = Chapter;