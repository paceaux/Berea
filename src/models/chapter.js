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
        return this.data.content || '';
    }

    get verseCount() {
        return this.data.verseCount || 0;
    }

    get verseList() {
        const verses = [];

        if (typeof this.content === 'string' && this.verseCount > 0) {
            const splitRegex = new RegExp(/(?:\[[0-9]+\]\s)/);
            const verseSplit = this.content.split(splitRegex);
            const verseArray = verseSplit.map((verse) => verse.trim().replace('\n',''));
            verses.push(...verseArray.filter((el) => el))
        }
        return verses;
    }

    get previousChapter() {
        let chapter = null;
        const { data : { previous }} = this;

        if (previous && previous.id) {
            const { number, bookId } = previous;
            chapter = new Chapter(previous.id, this.bible);
        }
        return chapter;
    }

    get nextChapter() {
        let chapter = null;
        const { data : { next }} = this;
        
        if (next && next.id) {
            const { number, bookId } = next;
            chapter = new Chapter(next.id, this.bible);
        }
        return chapter;
    }

    async getPrevious() {
        let chapter = this.previousChapter;

        try {
            await chapter.refreshData();
        } catch (getChapterError) {
            console.error(getChapterError);
        }

        return chapter;
    }

    async getNext() {
        let chapter = this.nextChapter;

        try {
            await chapter.refreshData();
        } catch (getChapterError) {
            console.error(getChapterError);
        }

        return chapter;
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