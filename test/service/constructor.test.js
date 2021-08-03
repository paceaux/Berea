const Berea = require('../../src/bibleService');

describe('prototype', () => {
  it('has BibleTypes', () => {
    expect(Berea).toHaveProperty('BibleTypes');
  });
  it('has RequestParameters', () => {
    expect(Berea).toHaveProperty('RequestParameters');
  });
});
describe('constructor', () => {
  it('applies an api key', () => {
    const api = new Berea('5ae573a324440896fabd2942943728a5');
    expect(api).toHaveProperty('apikey', '5ae573a324440896fabd2942943728a5');
  });
  describe('bibleType', () => {
    it('has a default of text', () => {
      const api = new Berea('5ae573a324440896fabd2942943728a5', 1);
      expect(api).toHaveProperty('medium', 'text');
    });

    it('can be set to audio', () => {
      const api = new Berea('5ae573a324440896fabd2942943728a5', 1, 'audio');
      expect(api).toHaveProperty('medium', 'audio');
    });
  });
  describe('bibleType', () => {
    it('when the type is text, the bibleType is bibles', () => {
      const api = new Berea('5ae573a324440896fabd2942943728a5', 1);
      expect(api).toHaveProperty('medium', 'text');
      expect(api).toHaveProperty('bibleType', 'bibles');
    });

    it('when the type is audio, the bibleType is audio-bibles', () => {
      const api = new Berea('5ae573a324440896fabd2942943728a5', 1, 'audio');
      expect(api).toHaveProperty('medium', 'audio');
      expect(api).toHaveProperty('bibleType', 'audio-bibles');
    });
  });

  describe('has a version', () => {
    it('has a default version', () => {
      const api = new Berea('5ae573a324440896fabd2942943728a5');
      expect(api).toHaveProperty('version', 1);
    });
    it('has can set a version', () => {
      const api = new Berea('5ae573a324440896fabd2942943728a5', 2);
      expect(api).toHaveProperty('version', 2);
    });
  });
  describe('has dependencies', () => {
    it('has default dependencies', () => {
      const api = new Berea('5ae573a324440896fabd2942943728a5', 2);
      expect(api).toHaveProperty('dependencies');
      expect(api.dependencies).toBeInstanceOf(Object);
    });
    it('has axios in dependencies by default', () => {
      const api = new Berea('5ae573a324440896fabd2942943728a5', 2);
      expect(api.dependencies).toHaveProperty('Axios');
      expect(api.dependencies.Axios).toBeInstanceOf(Object);
    });
  });
  describe('has an axios object', () => {
    it('it has an axios object', () => {
      const api = new Berea('5ae573a324440896fabd2942943728a5', 1);
      expect(api).toHaveProperty('axios');
      expect(api.axios).toBeInstanceOf(Object);
      expect(api.axios.defaults.headers).toHaveProperty('api-key', '5ae573a324440896fabd2942943728a5');
      expect(api.axios.defaults).toHaveProperty('baseURL', 'https://api.scripture.api.bible/v1');
    });
  });
});
describe('static methods', () => {
  describe('hyphenate parameters', () => {
    it('will hyphenate allowed parameters', () => {
      const result = Berea.hyphenateParameters(
        {
          includeTitles: true,
          contentType: 'html',
        },
      );
      expect(result).toHaveProperty('include-titles', true);
      expect(result).toHaveProperty('content-type', 'html');
    });
    it('leaves alone pre-hyphenated params', () => {
      const result = Berea.hyphenateParameters(
        {
          'include-titles': true,
          'content-type': 'html',
        },
      );
      expect(result).toHaveProperty('include-titles', true);
      expect(result).toHaveProperty('content-type', 'html');
    });
  });
});
