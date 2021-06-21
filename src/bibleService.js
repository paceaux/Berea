const Axios = require('axios');

const { RequestParameters, BibleTypes } = require('./constants');

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
 * @typedef PassageRequestParam
 * @property {string} id id of the Bible whose book to fetch
 * @property {string} passageId id of the book to fetch
 * @property {string} [contentType=html] html, json, text
 * @property {boolean} [includeNotes] include footnotes in content
 * @property {boolean} [includeTitles=true] include footnotes in content
 * @property {boolean} [includeChapterNumbers=false] include chapter numbers in content
 * @property {boolean} [includeVerseNumbers=false] include verse numbers in content
 * @property {boolean} [includeVerseSpans=false] include spans that wrap verse numbers and verse text for bible content
 * @property {Array<string>} [parallels] comma separated list of bibleIds
 * @property {boolean} [useOrgId=false] Use the supplied id(s) to match the verseOrgId instead of verseId. Defaults to false.
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
 * @typedef Passage
 * @property {string} id
 * @property {string} bibleId
 * @property {string} orgId
 * @property {string} content
 * @property {string} reference 
 * @property {number} verseCount
 * @property {string} copyright
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


class BibleService {
	_apikey = '';

	/**
	 * @param  {string} apikey
	 * @param  {number|string} version=1
	 * @param  {BibleTypes} type='text'
	 * @param  {} dependencies={Axios}
	 */
	constructor(apikey, version = 1, medium='text', dependencies = {Axios}) {

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
		return this._apikey;
	}

	set apikey(key) {
		this._apikey = key;
		this.axios = BibleService.getAxiosInstance(this.dependencies, key, this.version);
	}

	/**
	 * @param  {object} dependencies the dependencies object passed it, containing an Axios
	 * @param  {string} apiKey
	 * @param  {number} version
	 */
	static getAxiosInstance(dependencies, apiKey, version)  {
		return dependencies.Axios.create({
			baseURL: `https://api.scripture.api.bible/v${version}`,
			headers: {
				'api-key': apiKey
			}
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
	 * @param  {} params
	 */
	static hyphenateParameters(params) {
		const newParams = {};

		Object.entries(params).forEach(([k,v]) => {
			if (BibleService.RequestParameters.has(k)) {
				newParams[BibleService.RequestParameters.get(k)] = v;
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

		const hyphenatedParams = BibleService.hyphenateParameters(params);
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
			const response = await axios.get(`/${this.bibleType}`, {
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
			const response = await axios.get(`/${this.bibleType}/${id}`);
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
			let temp = BibleService.getRoutesAndParamFromRequest(request);
			id = temp.id;
			params = temp.params;
		}

		try {
			const response = await axios.get(`/${this.bibleType}/${id}/books`, {
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
			const temp = BibleService.getRoutesAndParamFromRequest(request);
			id = temp.id;
			bookId = temp.bookId;
			params = temp.params;
		} 


		try {
			const response = await axios.get(`/${this.bibleType}/${id}/books/${bookId}`, {
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
			const temp = BibleService.getRoutesAndParamFromRequest(request);
			id = temp.id;
			bookId = temp.bookId;
			params = temp.params;
		}

		try {
			const response = await this.axios.get(`/${this.bibleType}/${id}/books/${bookId}/chapters`,{
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
			const response = await this.axios.get(`/${this.bibleType}/${id}/chapters/${chapterId}`,{
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
	 * @param  {PassageRequestParam|string} request
	 * @param  {string} passageIdStr
	 *
	 * @returns {Passage}
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
			const response = await this.axios.get(`/${this.bibleType}/${id}/passages/${passageId}`,{
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
			const response = await this.axios.get(`/${this.bibleType}/${id}/chapters/${chapterId}/verses`,{
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
			const response = await this.axios.get(`/${this.bibleType}/${id}/verses/${verseId}`,{
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

module.exports = BibleService;
