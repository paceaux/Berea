/**
 * enum for all the parameters that can be submitted through any of the service methods
 *
 * @readonly
 * @enum {string}
 */

const RequestParameters = new Map([
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
  ['q', 'query'],
  ['l', 'limit'],
  ['o', 'offset'],
  ['s', 'sort'],
  ['r', 'range'],
  ['passage', 'range'],
  ['passages', 'range'],
  ['f', 'fuzziness'],

]);

module.exports = RequestParameters;
