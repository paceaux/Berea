/**
 * enum for kinds of media for the bible (text or audio)
 * @readonly
 * @enum {string}
 */

const BibleTypes = new Map([
  ['text', 'bibles'],
  ['audio', 'audio-bibles'],
]);

module.exports = BibleTypes;
