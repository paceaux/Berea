const Axios = require('axios');

/**
 * @typedef ParseApiRequest
 * @property {string} id bibleId
 * @property {string} bookId bibleId
 * @property {string} chapterId bibleId
 * @property {string} sectionId bibleId
 * @property {object} params additional parameters to submit to api


/**
 * @typedef BiblesRequestParam
 * @property {string} language ISO 639-3 three digit language code used to filter results
 * @property {string} abbreviation Bible abbreviation to search for
 * @property {string} name Bible name to search for
 * @property {Array<string>} ids Comma separated list of Bible Ids to return
 */

/**
 * @typedef BooksRequestParam
 * @property {string} id id of the Bible whose book to fetch
 * @property {boolean} [includeChapters=false] Boolean indicating if an array of chapter summaries should be included in the results. Defaults to false.
 * @property {boolean} [includeChaptersAndSections=false] Boolean indicating if an array of chapter summaries and an array of sections should be included in the results
 */

/**
 * @typedef BookRequestParam
 * @property {string} id id of the Bible whose book to fetch
 * @property {string} bookId id of the book to fetch
 * @property {boolean} [includeChapters=false] Boolean indicating if an array of chapter summaries should be included in the results. Defaults to false.
 */


/**
 * @typedef ChaptersRequestParam
 * @property {string} id id of the Bible whose book to fetch
 * @property {string} bookId id of the book to fetch
 * @property {boolean} [includeChapters=false] Boolean indicating if an array of chapter summaries should be included in the results. Defaults to false.
 */

/**
 * @typedef ChapterRequestParam
 * @property {string} id id of the Bible whose book to fetch
 * @property {string} bookId id of the book to fetch
 * @property {string} [contentType] html, json, text
 * @property {boolean} [includeNotes] include footnotes in content
 * @property {boolean} [includeTitles] include footnotes in content
 * @property {boolean} [includeChapterNumbers] include chapter numbers in content
 * @property {boolean} [includeVerseNumbers] include verse numbers in content
 * @property {boolean} [includeVerseSpans] include spans that wrap verse numbers and verse text for bible content
 * @property {Array<string>} [parallels] comma separated list of bibleIds
 * @property {boolean} [includeChapters=false] Boolean indicating if an array of chapter summaries should be included in the results. Defaults to false.
 */

/**
 * @typedef Bible
 * @property {string} id
 * @property {string} dblId
 * @property {string} abbreviation
 * @property {string} abbreviationLocal
 * @property {string} copyright
 * @property {object} language
 * @property {Array<Object>} countries
 * @property {string} name
 * @property {string} nameLocal
 * @property {string} description
 * @property {string} descriptionLocal
 * @property {string} info
 * @property {string} type
 * @property {Date} updatedAt
 * @property {string} relatedDbl
 * @property {Array<Object>} audioBibles
 */

/**
 * @typedef Book
 * @property {string} id
 * @property {string} bibleId
 * @property {string} abbreviation
 * @property {string} name
 * @property {string} nameLong
 * @property {Array<Chapter>} chapters
 */

/**
 * @typedef ChapterSummary
 * @property {string} id
 * @property {string} bibleId
 * @property {string} number
 * @property {string} bookId
 * @property {string} content
 * @property {string} reference

 */


/**
 * @typedef Chapter
 * @property {string} id
 * @property {string} bibleId
 * @property {string} number
 * @property {string} bookId
 * @property {string} content
 * @property {string} reference
 * @property {Number} verseCount
 * @property {string} copyright
 * @property {Object} next
 * @property {Object} previous
 */

/**
 * @typedef VerseSummary
 * @property {string} id
 * @property {string} orgId
 * @property {string} bibleId
 * @property {string} bookId
 * @property {string} chapterId
 * @property {string} reference

 */

/**
 * @typedef Verse
 * @property {string} id
 * @property {string} orgId
 * @property {string} bibleId
 * @property {string} bookId
 * @property {string} chapterId
 * @property {string} content
 * @property {string} reference
 * @property {Number} verseCount
 * @property {string} copyright
 * @property {Object} next
 * @property {Object} previous
 */

/**
 * enum for kinds of media for the bible
 * @readonly
 * @enum {string}
 */

const BaseRoutes = new Map([
	['text', 'bibles'],
	['audio', 'audio-bibles']
]);


/**
 * enum for all the parameters that can be submitted
 * @readonly
 * @enum {string}
 */

const GetParameters = new Map([
	['language', 'language'],
	['lang', 'language'],
	['abbreviation', 'abbreviation'],
	['abbr', 'abbreviation'],
	['includeFullDetails', 'include-full-details'],
	['fullDetails', 'include-full-details'],
	['includeChapters', 'include-chapters'],
	['chapters', 'include-chapters'],
	['includeChaptersAndSections', 'include-chapters-and-sections'],
	['chaptersAndSections', 'include-chapters-and-sections'],
	['contentType', 'content-type'],
	['includeNotes', 'include-notes'],
	['notes', 'include-notes'],
	['includeTitles', 'include-titles'],
	['titles', 'include-titles'],
	['includeChapterNumbers', 'include-chapter-numbers'],
	['chapterNumbers', 'include-chapter-numbers'],
	['includeVerseNumbers', 'include-verse-numbers'],
	['verseNumbers', 'include-verse-numbers'],
	['includeVerseSpans', 'include-verse-spans'],
	['verseSpans', 'include-verse-spans'],
	['useOrgId', 'use-org-id'],
	['orgId', 'use-org-id'],
]);


class BibleApi {
	/**
	 * @param  {string} apikey
	 * @param  {number|string} version=1
	 * @param  {BibleTypes} medium='text'
	 * @param  {} dependencies={Axios}
	 */
	constructor(apikey, version = 1, medium='text', dependencies = {Axios}) {
		this.apikey = apikey;
		this.version = version;
		this.medium = medium;
		this.dependencies = dependencies;

		this.axios = BibleApi.getAxiosInstance(dependencies, apikey, version);
	}

	static getAxiosInstance(dependencies, apiKey, version)  {
		return dependencies.Axios.create({
			baseURL: `https://api.scripture.api.bible/v${version}`,
			headers: {
				'api-key': apiKey
			}
		});
	}

	static get BibleRoutes() {
		return BaseRoutes;
	}

	static get GetParameters() {
		return GetParameters;
	}

	get baseRoute() {
		return BibleApi.BibleRoutes.get(this.medium);
	}

	static hyphenateParameters(params) {
		const newParams = {};

		Object.entries(params).forEach(([k,v]) => {
			if (BibleApi.GetParameters.has(k)) {
				newParams[BibleApi.GetParameters.get(k)] = v;
			}
		});

		return newParams;
	}

	/**
	 * @param  {object} request
	 * 
	 * @returns {ParsedApiRequest} 
	 */
	static getRoutesAndParamFromRequest(request) {
		let { id, bookId, chapterId, sectionId, verseId, passageId } = request;
		const params = {...request};
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

		const hyphenatedParams = BibleApi.hyphenateParameters(params);
		return { id,params: hyphenatedParams, bookId, chapterId, sectionId, verseId, passageId }
	}


	/**
	 * @param {BiblesRequestParam} param
	 *
	 * @returns {Array<Bible>}
	 */
	async getBibles(request) {
		const axios = this.axios;
		let result = null;

		try {
			const response = await axios.get('/bibles', {
				params: request
			});
			result = response.data.data;
		} catch (getError) {
			console.log(getError);
			result = getError;
		}
		return result;
	}


	/**
	 * @param  {string} id Gets Bible by Id
	 *
	 * @returns {Bible}
	 */
	async getBible(id) {
		if (!id) throw Error('id must be provided');
		const axios = this.axios;
		let result = null;

		try {
			const response = await axios.get(`/bibles/${id}`);
			result = response.data.data;
		} catch (getError) {
			console.log(getError);
			result = getError;
		}
		return result;
	}


	/**
	 * @param  {BooksRequestParam|string} request id of the bible or object containing id and parameters
	 *
	 * @returns {Array<Book>}
	 */
	async getBooks(request) {
		const axios = this.axios;
		let id = request;
		let params = null;
		let result = null;
	
		if (typeof request !==  'string' ) {
			let temp = BibleApi.getRoutesAndParamFromRequest(request);
			id = temp.id;
			params = temp.params;
		}

		try {
			const response = await axios.get(`/bibles/${id}/books`, {
				params
			});
			result = response.data.data;
		} catch (getError) {
			console.log(getError);
			result = getError;
		}
		return result;
	}


	/**
	 * @param  {string|BookRequestParam} request id of the bible or object containing id, bookId, and parameters
	 * @param  {string} [bookIdStr] id of the book to fetch. Not required if the request is an object.
	 *
	 * @returns {Book}
	 */
	async getBook(request, bookIdStr) {
		const axios = this.axios;
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
			const temp = BibleApi.getRoutesAndParamFromRequest(request);
			id = temp.id;
			bookId = temp.bookId;
			params = temp.params;
		} 


		try {
			const response = await axios.get(`/bibles/${id}/books/${bookId}`, {
				params
			});
			result = response.data.data;
		} catch (getError) {
			console.log(getError);
			result = getError;
		}
		return result;
	}


	/** Gets chapters from a single book
	 * @param  {ChaptersRequestParam|string} request id of the bible or object containing id, bookId, and parameters
	 * @param  {string} [bookIdStr]
	 *
	 * @returns {Array<ChapterSummary>}
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
			const temp = BibleApi.getRoutesAndParamFromRequest(request);
			id = temp.id;
			bookId = temp.bookId;
			params = temp.params;
		}

		try {
			const response = await this.axios.get(`/bibles/${id}/books/${bookId}/chapters`,{
				params
			});

			result = response.data.data;
		} catch (getError) {
			console.log(getError);
			result = getError;
		}
		return result;
	}
	/**
	 * @param  {ChapterRequestParam|string} request
	 * @param  {string} chapterIdStr
	 *
	 * @returns {Chapter}
	 */
	async getChapter(request, chapterIdStr) {
		let id;
		let chapterId;
		let params;
		let result = null;

		if (typeof request === 'string') {
			if (!chapterIdStr) throw new Error('bibleId provided as string without chapterId as second parameter');
			chapterId = chapterIdStr.toUpperCase();
			id = request;
		}

		if (typeof request === 'object') {
			const temp = BibleApi.getRoutesAndParamFromRequest(request);
			id = temp.id;
			chapterId = temp.chapterId;
			params = temp.params;
		}

		try {
			const response = await this.axios.get(`/bibles/${id}/chapters/${chapterId}`,{
				params
			});

			result = response.data.data;
		} catch (getError) {
			console.log(getError);
			result = getError;
		}
		return result;
	}

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
			const temp = BibleApi.getRoutesAndParamFromRequest(request);
			id = temp.id;
			passageId = temp.passageId;
			params = temp.params;
		}

		try {
			const response = await this.axios.get(`/bibles/${id}/passages/${passageId}`,{
				params
			});

			result = response.data.data;
		} catch (getError) {
			console.log(getError);
			result = getError;
		}
		return result;
	}

		/** Gets verses from a single chapter
 * @param  {ChaptersRequestParam|string} request id of the bible or object containing id, bookId, and parameters
 * @param  {string} [bookIdStr]
 *
 * @returns {Array<Chapter>}
 */
	async getVersesFromChapter(request, chapterIdStr) {
		let id;
		let chapterId;
		let params;
		let result = null;

		if (typeof request === 'string') {
			if (!chapterIdStr) throw new Error('bibleId provided as string without chapterId as second parameter');
			chapterId = chapterIdStr.toUpperCase();
			id = request;
		}

		if (typeof request === 'object') {
			const temp = BibleApi.getRoutesAndParamFromRequest(request);
			id = temp.id;
			chapterId = temp.chapterId;
			params = temp.params;
		}

		try {
			const response = await this.axios.get(`/bibles/${id}/chapters/${chapterId}/verses`,{
				params
			});

			result = response.data.data;
		} catch (getError) {
			console.log(getError);
			result = getError;
		}
		return result;
	}

	async getVerse(request, verseIdStr) {
		let id;
		let verseId;
		let params;
		let result = null;

		if (typeof request === 'string') {
			if (!verseIdStr) throw new Error('bibleId provided as string without verseId as second parameter');
			verseId = verseIdStr.toUpperCase();
			id = request;
		}

		if (typeof request === 'object') {
			const temp = BibleApi.getRoutesAndParamFromRequest(request);
			id = temp.id;
			verseId = temp.verseId;
			params = temp.params;
		}

		try {
			const response = await this.axios.get(`/bibles/${id}/verses/${verseId}`,{
				params
			});

			result = response.data.data;
		} catch (getError) {
			console.log(getError);
			result = getError;
		}
		return result;
	}
}

module.exports = BibleApi;
