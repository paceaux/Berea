const BibleEntity = require('./bible-entity');


class Chapter extends BibleEntity {

    constructor(data, bible) {
        super(data, bible);

    }
    get name() {
        return this.data.reference;
    }

    get bookId() {
        return this.data.bookId || this.id.split('.')[0];
    }

    get number() {
        return this.data.number || this.id.split('.')[1];
    }

    get content() {
        return this.data.content || {};
    }

    get verseCount() {
        return this.data.verseCount || 0;
    }

    async refreshData() {
        const data = await this.bibleService.getChapter(
            {
                contentType: 'text',
                id: this.bible.id,
                chapterId: this.id,
            }
        );
        this.data = data;
    }

}

module.exports = Chapter;