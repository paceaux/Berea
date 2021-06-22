const Entity = require('./entity.model');
const Book = require('./book.model');
const Chapter = require('./chapter.model');
const Passage = require('./passage.model');
const Verse = require('./verse.model');

class Bible extends Entity {
    /**
     * All books in the bible. populated after running refreshData()
     * @type {Array<string>}
     * @public
     */
    books = [];

    /**
     * Retrieves data from API and populates data property and books property.
     */
    async refreshData() {
      const data = await this.bibleService.getBible(this.id);
      const books = await this.getBooks();
      this.books.push(...books);
      this.data = data;
    }

    /** Gets all of the books associated with the Bible
     * @param  {BooksRequestParam} params
     */
    async getBooks(params) {
      const request = { ...params, id: this.id };
      let result = null;

      try {
        const books = await this.bibleService.getBooks(request);
        result = books.map((book) => new Book(book, this));
      } catch (getError) {
        console.log(getError);
        result = getError;
      }
      return result;
    }

    prepareRequest(params, requestId) {
      const request = { id: this.id };
      if (typeof params === 'object') {
        const temp = { ...params };
        if (temp.id) {
          temp[requestId] = temp.id;
          delete temp.id;
        }
        Object.assign(request, temp);
      }

      if (typeof params === 'string') {
        request[requestId] = params;
      }
      return request;
    }

    /** Gets a book from the Bible
     * @param  {BookRequestParam|string} params either an object with id or bookId, or a string that is the bookId
     */
    async getBook(params) {
      let result = null;
      const request = this.prepareRequest(params, 'bookId');

      try {
        const data = await this.bibleService.getBook(request);
        result = new Book(data, this);
      } catch (getError) {
        console.log(getError);
        result = getError;
      }
      return result;
    }

    /** Gets a chapter by Id from the Bible
     * @param  {ChapterRequestParam|string} params
     */
    async getChapter(params) {
      let result = null;
      const request = this.prepareRequest(params, 'chapterId');

      try {
        const data = await this.bibleService.getChapter(request);
        result = new Chapter(data, this);
      } catch (getError) {
        console.log(getError);
        result = getError;
      }
      return result;
    }

    async getPassage(params) {
      let result = null;
      const request = this.prepareRequest(params, 'passageId');

      try {
        const data = await this.bibleService.getPassage(request);
        result = new Passage(data, this);
      } catch (getError) {
        console.log(getError);
        result = getError;
      }
      return result;
    }

    async getVerse(params) {
      let result = null;
      const request = this.prepareRequest(params, 'verseId');

      try {
        const data = await this.bibleService.getVerse(request);
        result = new Verse(data, this);
      } catch (getError) {
        console.log(getError);
        result = getError;
      }
      return result;
    }
}

module.exports = Bible;
