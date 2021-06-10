const BibleEntity = require('./entity');
const Chapter = require('./chapter');


class Passage extends BibleEntity {
    constructor(data, bibleService) {
        super(data, bibleService);

    }

    get chapters() {
        const { chapterIds } = this.data;
        const chapters = [];


        if (chapterIds && chapterIds.length) {
            const chapterObjects = chapterIds.map((chapterId) => {
                return new Chapter(chapterId, this.bibleService);
            });
            chapters.push(...chapterObjects);
        }
        return chapters;
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
        const data = await this.bibleService.getPassage(this.id);
        this.data = data;
    }

}

module.exports = Passage;