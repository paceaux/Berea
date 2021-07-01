const Entity = require('./entity.model');
const Bible = require('./bible.model');

/**
 * @typedef {import('../bible.model')} Bible
 */
class BibleEntity extends Entity {
  /**
   * @type {Bible}
   * @public
   */
  bible = null;

  /**
   * @param  {object} data Some sort of response data
   * @param  {Bible} bible A Bible object
   */
  constructor(data, bible) {
    super(data, bible.bibleService);

    if (typeof bible === 'string') {
      this.bible = new Bible(bible, bible.bibleService);
    } else {
      this.bible = bible;
    }
  }
}

module.exports = BibleEntity;
