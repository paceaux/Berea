const Axios = require('axios');

const { RequestParameters, BibleTypes } = require('./constants');

/**
 * @typedef ParsedApiRequest
 * @property {string} id bibleId
 * @property {string} bookId bibleId
 * @property {string} chapterId bibleId
 * @property {string} sectionId bibleId
 * @property {object} params additional parameters to submit to api
 */

/**
 * @typedef BiblesRequestParam
 * @property {string} language ISO 639-3 three digit language code used to filter results
 * @property {string} abbreviation Bible abbreviation to search for
 * @property {string} name Bible name to search for
 * @property {Array<string>} ids Comma separated list of Bible Ids to return
 * @see {@link https://scripture.api.bible/livedocs#/Bibles/getBibles|Bibles}
 */

/**
 * @typedef BooksRequestParam
 * @property {string} id id of the Bible whose book to fetch
 * @property {boolean} [includeChapters=false] An array of chapter summaries should be in the results.
 * @property {boolean} [includeChaptersAndSections=false] Arrays of chapter summaries and sections should be in the results
 * @see {@link https://scripture.api.bible/livedocs#/Bibles/Books/getBooks|Books}
 */

/**
 * @typedef BookRequestParam
 * @property {string} id id of the Bible whose book to fetch
 * @property {string} bookId id of the book to fetch (e.g. GEN)
 * @property {boolean} [includeChapters=false] Array of chapter summaries should be in the results.
 * @see {@link https://scripture.api.bible/livedocs#/Bibles/Books/getBook|Book}
 */

/**
 * @typedef ChaptersRequestParam
 * @property {string} id id of the Bible whose book to fetch
 * @property {string} chapterId id of the chapter to fetch (e.g. GEN.1)
 * @see {@link https://scripture.api.bible/livedocs#/Bibles/Chapters/getChapters|Chapters}
 */

/**
 * @typedef ChapterRequestParam
 * @property {string} id id of the Bible whose book to fetch
 * @property {string} chapterId id of the chapter to fetch (e.g. GEN.1)
 * @property {string} [contentType=html] html, json, text
 * @property {boolean} [includeNotes=false] include footnotes in content
 * @property {boolean} [includeTitles=true] include section titles in content
 * @property {boolean} [includeChapterNumbers=false] include chapter numbers in content
 * @property {boolean} [includeVerseNumbers=true] include verse numbers in content
 * @property {boolean} [includeVerseSpans=false] include spans that wrap verse numbers and verse text for bible content
 * @property {Array<string>} [parallels] comma separated list of bibleIds
 * @property {boolean} [includeChapters=false] Boolean indicating if an array of chapter summaries should be in the results.
 * @see {@link https://scripture.api.bible/livedocs#/Bibles/Chapters/getChapter|Chapter}
 */

/**
 * @typedef PassageRequestParam
 * @property {string} id id of the Bible whose book to fetch
 * @property {string} passageId id of the passage to fetch (e.g. GEN.1.1-GEN.2.20)
 * @property {string} [contentType=html] html, json, text
 * @property {boolean} [includeNotes] include footnotes in content
 * @property {boolean} [includeTitles=true] include section titles in content
 * @property {boolean} [includeChapterNumbers=false] include chapter numbers in content
 * @property {boolean} [includeVerseNumbers=true] include verse numbers in content
 * @property {boolean} [includeVerseSpans=false] include spans that wrap verse numbers and verse text for bible content
 * @property {Array<string>} [parallels] comma separated list of bibleIds
 * @property {boolean} [useOrgId=false] Use the supplied id(s) to match the verseOrgId instead of verseId.
 * @see {@link https://scripture.api.bible/livedocs#/Bibles/Passages/getPassage|Passage}
 */

/**
 * @typedef VersesRequestParam
 * @property {string} id id of the Bible whose book to fetch
 * @property {string} chapterId id of the chapter from which to fetch  verses (e.g. GEN)
 * @see {@link https://scripture.api.bible/livedocs#/Bibles/Verses/getVerses|Verses}
 */

/**
 * @typedef VerseRequestParam
 * @property {string} id id of the Bible whose book to fetch
 * @property {string} verseId id of the verse to fetch (e.g. GEN.1.1)
 * @property {string} [contentType=html] html, json, text
 * @property {boolean} [includeNotes=false] include footnotes in content
 * @property {boolean} [includeTitles=true] include section titles in content
 * @property {boolean} [includeChapterNumbers=false] include chapter numbers in content
 * @property {boolean} [includeVerseNumbers=false] include verse numbers in content
 * @property {boolean} [includeVerseSpans=false] include spans that wrap verse numbers and verse text for bible content
 * @property {Array<string>} [parallels] comma separated list of bibleIds
 * @property {boolean} [useOrgId=false] Use the supplied id(s) to match the verseOrgId instead of verseId.
 * @see {@link https://scripture.api.bible/livedocs#/Bibles/Verses/getVerse|Verse}
 */

/**
 * @typedef BibleResponse
 * @property {string} id unique identifier of the bible
 * @property {string} dblId not sure. Similar to id, but without trailing -01
 * @property {string} abbreviation 3-letter common abbreviation (e.g. ASV, KJV, NIV)
 * @property {string} abbreviationLocal localized abbreviation
 * @property {string} copyright copyright notice
 * @property {object} language ISO language
 * @property {Array<object>} countries countries bible was published for
 * @property {string} name name of bible
 * @property {string} nameLocal localized (translated) name
 * @property {string} description Summary of the bible
 * @property {string} descriptionLocal localized (Translated) summary
 * @property {string} info metadata
 * @property {string} type kind of bible
 * @property {Date} updatedAt last time content was updated
 * @property {string} relatedDbl not sure
 * @property {Array<object>} audioBibles audio versions of this bible
 * @see {@link https://scripture.api.bible/livedocs#/Bibles/getBibles|Bibles}
 */

/**
 * @typedef BookResponse
 * @property {string} id 3-letter identifier of the book
 * @property {string} bibleId id of the bible
 * @property {string} abbreviation user readable abbreviation
 * @property {string} name name of the book
 * @property {string} nameLong extended name
 * @property {Array<ChapterSummaryResponse>} chapters Small details of the chapters within the book
 * @see {@link https://scripture.api.bible/livedocs#/Bibles/Books/getBooks|Books}
 */

/**
 * @typedef ChapterSummaryResponse chapter data without verses
 * @property {string} id 3-letter identifier for book and integer (e.g. GEN.1)
 * @property {string} bibleId id of the containing bible
 * @property {string} number integer; chapter number
 * @property {string} bookId 3-letter identifier for book
 * @property {string} content text
 * @property {string} reference reader friendly version (e.g. Genesis 1)
 * @see {@link https://scripture.api.bible/livedocs#/Bibles/Chapters/getChapters|Chapters}
 */

/**
 * @typedef ChapterResponse chapter data with verse info
 * @property {string} id 3-letter identifier for book and integer (e.g. GEN.1)
 * @property {string} bibleId id of the containing bible
 * @property {string} number integer; chapter number
 * @property {string} bookId 3-letter identifier for book
 * @property {string} content text
 * @property {string} reference reader friendly version (e.g. Genesis 1)
 * @property {number} verseCount quantity of verses
 * @property {string} copyright copyright information
 * @property {object} next chapter number and ID of the next chapter in the book
 * @property {object} previous chapter number and ID of the previous chapter in the book
 * @see {@link https://scripture.api.bible/livedocs#/Bibles/Chapters/getChapter|Chapter}
 */

/**
 * @typedef VerseSummaryResponse
 * @property {string} id 3-letter identifier for book and integer (e.g. GEN.1.1)
 * @property {string} bibleId id of the containing bible
 * @property {string} bookId 3-letter identifier for book
 * @property {string} chapterId 3-letter book name with chapter number (e.g. GEN.1)
 * @property {string} orgId no idea
 * @property {string} reference reader friendly version (e.g. Genesis 1.1)
 * @see {@link https://scripture.api.bible/livedocs#/Bibles/Verses/getVerses|Verses}
 */

/**
 * @typedef PassageResponse
 * @property {string} id 3-letter identifier for book and integer (e.g. GEN.1.1-GEN.2.1)
 * @property {string} bibleId id of the containing bible
 * @property {string} orgId no idea
 * @property {string} reference reader friendly version (e.g. Genesis 1:1-21)
 * @property {string} content text content
 * @property {number} verseCount quantity of verses
 * @property {string} copyright copyright information
 * @see {@link https://scripture.api.bible/livedocs#/Bibles/Passages/getPassage|Passage}
 */

/**
 * @typedef VerseResponse
 * @property {string} id 3-letter identifier for book and integer (e.g. GEN.1)
 * @property {string} bibleId id of the containing bible
 * @property {string} bookId 3-letter identifier for book
 * @property {string} chapterId 3-letter book name with chapter number (e.g. GEN.1)
 * @property {string} orgId no idea
 * @property {string} content text content
 * @property {string} reference reader friendly version (e.g. Genesis 1:1)
 * @property {number} verseCount quantity of verses
 * @property {string} copyright copyright information
 * @property {object} next verse number and ID of the next verse in the book
 * @property {object} previous verse number and ID of the previous verse in the book
 * @see {@link https://scripture.api.bible/livedocs#/Bibles/Verses/getVerse|Verse}
 */

class BibleService {
    #apikey = '';

    /**
     * @param  {string} apikey api key needed
     * @param  {number|string} [version=1] version of api
     * @param  {BibleTypes} [medium='text'] audio or text bible
     * @param  {object} [dependencies={Axios}] axios library
     */
    constructor(apikey, version = 1, medium = 'text', dependencies = { Axios }) {
      /**
       * @type {string}
       * @public
       */
      this.version = version;

      /**
       * @type {string}
       * @private
       */
      this.medium = medium;

      /**
       * @type {object}
       * @public
       */
      this.dependencies = dependencies;

      /**
       * @type {string}
       * @public
       */
      this.apikey = apikey;

      /**
       * @type {object}
       * @public
       */
      this.axios = BibleService.getAxiosInstance(dependencies, apikey, version);
    }

    get apikey() {
      return this.#apikey;
    }

    set apikey(key) {
      this.#apikey = key;
      this.axios = BibleService.getAxiosInstance(this.dependencies, key, this.version);
    }

    /**
     * @param  {object} dependencies the dependencies object passed it, containing an Axios
     * @param  {string} apiKey apikey needed for.. the api
     * @param  {number} version version of the api
     * @returns {object} Axios instance
     */
    static getAxiosInstance(dependencies, apiKey, version) {
      return dependencies.Axios.create({
        baseURL: `https://api.scripture.api.bible/v${version}`,
        headers: {
          'api-key': apiKey,
        },
      });
    }

    /**
     * @type {import('./constants').BibleTypes}
     */
    static BibleTypes = BibleTypes;

    /**
     * @type {import('./constants').RequestParameters}
     */
    static RequestParameters = RequestParameters;

    get bibleType() {
      return BibleService.BibleTypes.get(this.medium);
    }

    /**
     * Converts camelcased parameters into hyphenated ones
     *
     * @param  {object} params object with camelcased parameters
     * @returns {object} object with hyphenated properties
     */
    static hyphenateParameters(params) {
      const newParams = {};

      Object.entries(params).forEach(([k, v]) => {
        if (BibleService.RequestParameters.has(k)) {
          newParams[BibleService.RequestParameters.get(k)] = v;
        }
      });

      return newParams;
    }

    /**
     * extracts all the different ids and parameters from an object
     *
     * @param  {object} request the options request to go to the api
     * @returns {ParsedApiRequest} object with each id identified, and remaining options
     */
    static getRoutesAndParamFromRequest(request) {
      let {
        bookId, chapterId, sectionId, verseId, passageId,
      } = request;
      const { id } = request;
      const params = { ...request };
      delete params.id;

      if (bookId) {
        delete params.bookId;
        bookId = bookId.toUpperCase();
      }
      if (chapterId) {
        delete params.chapterId;
        chapterId = chapterId.toUpperCase();
      }
      if (sectionId) {
        delete params.sectionId;
        sectionId = sectionId.toUpperCase();
      }
      if (verseId) {
        delete params.verseId;
        verseId = verseId.toUpperCase();
      }
      if (passageId) {
        delete params.passageId;
        passageId = passageId.toUpperCase();
      }

      const hyphenatedParams = BibleService.hyphenateParameters(params);
      return {
        id, params: hyphenatedParams, bookId, chapterId, sectionId, verseId, passageId,
      };
    }

    /**
     * @param {BiblesRequestParam} [request] options to send
     * @returns {Promise<Array<BibleResponse>>} An array of bibles
     */
    async getBibles(request) {
      const { axios } = this;
      let result = null;

      try {
        const response = await axios.get(`/${this.bibleType}`, {
          params: request,
        });
        result = response.data.data;
      } catch (getError) {
        result = getError;
      }
      return result;
    }

    /**
     * @param  {string} id Gets Bible by Id
     * @returns {Promise<BibleResponse>} Bible data
     */
    async getBible(id) {
      if (!id) throw Error('id must be provided');
      const { axios } = this;
      let result = null;

      try {
        const response = await axios.get(`/${this.bibleType}/${id}`);
        result = response.data.data;
      } catch (getError) {
        result = getError;
      }
      return result;
    }

    /**
     * @param  {BooksRequestParam|string} request id of the bible or object containing id and parameters
     * @returns {Promise<Array<BookResponse>>} an array of bookdata
     */
    async getBooks(request) {
      const { axios } = this;
      let id = request;
      let params = null;
      let result = null;

      if (typeof request !== 'string') {
        const temp = BibleService.getRoutesAndParamFromRequest(request);
        id = temp.id;
        params = temp.params;
      }

      try {
        const response = await axios.get(`/${this.bibleType}/${id}/books`, {
          params,
        });
        result = response.data.data;
      } catch (getError) {
        result = getError;
      }
      return result;
    }

    /**
     * @param  {string|BookRequestParam} request id of the bible or object containing id, bookId, and parameters
     * @param  {string} [bookIdStr] id of the book to fetch. Not required if the request is an object.
     * @returns {Promise<BookResponse>} book data
     */
    async getBook(request, bookIdStr) {
      const { axios } = this;
      let id;
      let bookId;
      let params;
      let result = null;

      if (typeof request === 'string') {
        if (!bookIdStr) throw new Error('bibleId provided as string without bookId as second parameter');
        id = request;
        bookId = bookIdStr.toUpperCase();
      }

      if (typeof request === 'object') {
        const temp = BibleService.getRoutesAndParamFromRequest(request);
        id = temp.id;
        bookId = temp.bookId;
        params = temp.params;
      }

      try {
        const response = await axios.get(`/${this.bibleType}/${id}/books/${bookId}`, {
          params,
        });
        result = response.data.data;
      } catch (getError) {
        result = getError;
      }
      return result;
    }

    /**
     * Gets chapters from a single book
     *
     * @param  {ChaptersRequestParam|string} request id of the bible or object containing id, bookId, and parameters
     * @param  {string} [bookIdStr=''] id for the book. Not needed if request is an object and has bookId
     * @returns {Promise<Array<ChapterSummaryResponse>>} Chapterdata
     */
    async getChaptersFromBook(request, bookIdStr) {
      let id;
      let bookId;
      let params;
      let result = null;

      if (typeof request === 'string') {
        if (!bookIdStr) throw new Error('bibleId provided as string without bookId as second parameter');
        bookId = bookIdStr;
        id = request;
      }

      if (typeof request === 'object') {
        const temp = BibleService.getRoutesAndParamFromRequest(request);
        id = temp.id;
        bookId = temp.bookId;
        params = temp.params;
      }

      try {
        const response = await this.axios.get(`/${this.bibleType}/${id}/books/${bookId}/chapters`, {
          params,
        });

        result = response.data.data;
      } catch (getError) {
        result = getError;
      }
      return result;
    }

    /**
     * @param  {ChapterRequestParam|string} request options object
     * @param  {string} chapterIdStr chapter id. not needed if request has chapterId
     * @returns {Promise<ChapterResponse>} The chapter
     */
    async getChapter(request, chapterIdStr) {
      let id;
      let chapterId;
      let params;
      let result = null;

      if (typeof request === 'string') {
        if (!chapterIdStr) throw new Error('bibleId provided as string without chapterId as second parameter');
        chapterId = chapterIdStr.toLowerCase(); // if the chapter is .intro it must be lowercase
        id = request;
      }

      if (typeof request === 'object') {
        const temp = BibleService.getRoutesAndParamFromRequest(request);
        id = temp.id;
        chapterId = temp.chapterId.toLowerCase();
        params = temp.params;
      }

      try {
        const response = await this.axios.get(`/${this.bibleType}/${id}/chapters/${chapterId}`, {
          params,
        });

        result = response.data.data;
      } catch (getError) {
        result = getError;
      }
      return result;
    }

    /**
     * @param  {PassageRequestParam|string} request options or string with bible id
     * @param  {string} passageIdStr id of passage (e.g. GEN.1.1-GEN.2.2)
     * @returns {Promise<PassageResponse>} passageData
     */
    async getPassage(request, passageIdStr) {
      let id;
      let passageId;
      let params;
      let result = null;

      if (typeof request === 'string') {
        if (!passageIdStr) throw new Error('bibleId provided as string without passageId as second parameter');
        passageId = passageIdStr.toUpperCase();
        id = request;
      }

      if (typeof request === 'object') {
        const temp = BibleService.getRoutesAndParamFromRequest(request);
        id = temp.id;
        passageId = temp.passageId;
        params = temp.params;
      }

      try {
        const response = await this.axios.get(`/${this.bibleType}/${id}/passages/${passageId}`, {
          params,
        });

        result = response.data.data;
      } catch (getError) {
        result = getError;
      }
      return result;
    }

    /**
     * Gets verses from a single chapter
     *
     * @param  {VersesRequestParam|string} request id of the bible or object containing id, bookId, and parameters
     * @param  {string} [chapterIdStr] chapterId (e.g. GEN.1)
     * @returns {Promise<Array<VerseSummaryResponse>>} chapterdata
     */
    async getVersesFromChapter(request, chapterIdStr) {
      let id;
      let chapterId;
      let params;
      let result = null;

      if (typeof request === 'string') {
        if (!chapterIdStr) throw new Error('bibleId provided as string without chapterId as second parameter');
        chapterId = chapterIdStr.toLowerCase(); // if the chapter is .intro it must be lowercase
        id = request;
      }

      if (typeof request === 'object') {
        const temp = BibleService.getRoutesAndParamFromRequest(request);
        id = temp.id;
        chapterId = temp.chapterId.toLowerCase();
        params = temp.params;
      }

      try {
        const response = await this.axios.get(`/${this.bibleType}/${id}/chapters/${chapterId}/verses`, {
          params,
        });

        result = response.data.data;
      } catch (getError) {
        result = getError;
      }
      return result;
    }

    /**
     * Get a verse
     *
     * @param  {VerseRequestParam|string} request id of the bible or object containing id, bookId, and parameters
     * @param  {string} [verseIdStr] verseId (e.g. GEN.1.1) not needed if the request parameter has verseId
     * @returns {Promise<Array<VerseResponse>>} versedata
     */
    async getVerse(request, verseIdStr) {
      let id;
      let verseId;
      let params;
      let result = null;

      if (typeof request === 'string') {
        if (!verseIdStr) throw new Error('bibleId provided as string without verseId as second parameter');
        verseId = verseIdStr.toLowerCase(); // if the chapter is .intro it must be lowercase
        id = request;
      }

      if (typeof request === 'object') {
        const temp = BibleService.getRoutesAndParamFromRequest(request);
        id = temp.id;
        verseId = temp.verseId.toLowerCase();
        params = temp.params;
      }

      try {
        const response = await this.axios.get(`/${this.bibleType}/${id}/verses/${verseId}`, {
          params,
        });

        result = response.data.data;
      } catch (getError) {
        result = getError;
      }
      return result;
    }
}

module.exports = BibleService;
