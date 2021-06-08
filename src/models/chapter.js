const BibleEntity = require('./entity');


class Chapter extends BibleEntity {
    constructor(data, bibleService) {
        super(data, bibleService);

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