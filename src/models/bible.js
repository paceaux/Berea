const BibleEntity = require('./entity');
class  Bible extends BibleEntity {

    /**
     * @param  {object|string} data full data object returned from api, or the id of a bible
     * @param  {BibleService|string} bibleService the BibleService, or the apikey that could be used to instantiate a service
     */
    constructor(data, bibleService ) {
        super(data, bibleService);

    }

    async refreshData() {
        const data = await this.bibleService.getBible();
        this.data = data;
    }

    async getBooks(params) {
        const request = {...params, id : this.id };
        let result = null;
        
        try {
            result = await this.bibleService.getBooks(request);
        } catch (getError) {
            console.log(getError);
            result = error;
        }
        return result;
    }

    async getBook(params) {
        const request = {...params, id : this.id };
        let result = null;
        
        try {
            result = await this.bibleService.getBook(request);
        } catch (getError) {
            console.log(getError);
            result = error;
        }
        return result;
    }


    async getChapter(params) {
        const request = {...params, id : this.id };
        let result = null;
        
        try {
            result = await this.bibleService.getChapter(request);
        } catch (getError) {
            console.log(getError);
            result = error;
        }
        return result;
    }

    async getPassage(params) {
        const request = {...params, id : this.id };
        let result = null;
        
        try {
            result = await this.bibleService.getPassage(request);
        } catch (getError) {
            console.log(getError);
            result = error;
        }
        return result;
    }

    async getPassage(params) {
        const request = {...params, id : this.id };
        let result = null;
        
        try {
            result = await this.bibleService.getVerse(request);
        } catch (getError) {
            console.log(getError);
            result = error;
        }
        return result;
    }


}

module.exports = Bible;