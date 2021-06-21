const BibleEntity = require('./bible-entity.model');
const Chapter = require('./chapter.model');

class Passage extends BibleEntity {
  get chapters() {
    const { chapterIds } = this.data;
    const chapters = [];

    if (chapterIds && chapterIds.length) {
      const chapterObjects = chapterIds
        .map((chapterId) => new Chapter(chapterId, this.bibleService));
      chapters.push(...chapterObjects);
    }
    return chapters;
  }

  get verseCount() {
    const { verseCount } = this.data;

    return verseCount || 0;
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
