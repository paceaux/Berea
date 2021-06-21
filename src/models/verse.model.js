const BibleEntity = require('./bible-entity.model');
const Chapter = require('./chapter.model');


class Verse extends BibleEntity {
    constructor(data, bible) {
        super(data, bible);

    }

    get chapter() {
        const { chapterId } = this.data;
        let chapter = null;

        if (chapterId) {
                chapter = new Chapter(chapterId, this.bibleService);
        }
        return chapter;
    }

    get verseCount() {
        const { verseCount } = this.data;
        
        return verseCount ? verseCount : 0;
    }

    get content() {
        const { content } = this.data;

        return content || '';
    }
    

    async refreshData() {
        const data = await this.bibleService.getVerse(this.id);
        this.data = data;
    }

}

module.exports = Verse;