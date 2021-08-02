# BibleApi
A Promised-wrapped Node library and ORM for [https://scripture.api.bible/](API.Bible). 

This includes a `bibleService` which is a promised-wrapped library for the API with some convenience methods. 

But it **also** includes an ORM that turns data  into `Bible`, `Book`, `Chapter`, `Verse`, and `Passage` objects that have their own convenience methods and relations for easier navigation of scripture. 

## Pre-requisites
* Node 12+
* NPM 6.14.12 

### API Token from Scripture.API.Bible
1. go to [https://scripture.api.bible](scripture.api.bible)
2. Sign up
3. Go to Applications
4. Create a new application
5. After it's created you will need the credentials

# Usage
This is thoroughly documented via JSDoc and a [Github Wiki](https://github.com/paceaux/BibleApi/wiki)

Using the API and this library amounts to three steps:

1. Create the Bible Service
2. Use the Bible service to get the id for a Bible
3. Do stuff with a Bible id

The Bible Id that you get is needed to get _any_ data from the API. For this reason, there exists a whole ORM that you can use which turns books, chapters, verses, and passages into objects that let you request data when you want it. 

But you can't get there until you have at least a service. 

## Creating a new Bible Service
You may want multiple services if you plan on using different versions of the api, or fetching text and audio. 

### Basic Example
```
const {BibleService} = require('bibleapi');

const service = new BibleService('someLongToken');
```

### Setting a Version
As the API itself is version controlled, the library is too. This is an optional second parameter:

```
const {BibleService} = require('bibleapi');

const service = new BibleService('someLongToken', 1);
```


### Setting the medium
The Bible API itself offers text and audio. As you may want one over the other, this is an optional third parameter. The options are `text` or `audio`. 

```
const {BibleService} = require('bibleapi');

const service = new BibleService('someLongToken', 1, 'audio');
```

## Setting options in requests
All of the [request options are documented](https://github.com/paceaux/BibleApi/wiki/Request-Parameters). One notable difference between how this library works is that _options can be camelCased_.

While the [API](https://scripture.api.bible/livedocs#/) will require `content-type` if you want to set options, you can send `contentType`. 

Look in `src/constants/requestParameters.js` for all of the aliases. `RequestParameters` is also set as a static property on the `BibleService` class. 

## Getting Bibles
Before getting verses, chapters, or passages, you need a `bibleId`. The only way to know _that_ is to look at all of the Bibles, first. 

### Get all Bibles
* [Request Options](https://github.com/paceaux/BibleApi/wiki/Request-Parameters#BiblesRequestParam)  ( an array)

```
async function doThings() {
  const bibles = await service.getBibles();

}
```

### Get Bibles with options
* [Response](https://github.com/paceaux/BibleApi/wiki/Response-Types#BibleResponse) (an array)

```
async function doThings() {
  const bibles = await service.getBibles({
    language: 'eng'
  });

}
```

### Get One Bible
* [Response](https://github.com/paceaux/BibleApi/wiki/Response-Types#BibleResponse)
* Request: only a string

Once you've found a `bibleId`, you can get some information on it. 
```
async function doThings() {
  const bible = await service.getBible('06125adad2d5898a-01');

}
```

## Getting Books
About `bookId`:

A `bookId` is typically the first 3-letters of the  name of a book. 

e.g.
* Exodus => <samp>EXO</samp>
* Mark => <samp>MAR</samp>


### Get all books from a Bible (no options)
* [Request Options](https://github.com/paceaux/BibleApi/wiki/Request-Parameters#booksrequestparam)
* [Response](https://github.com/paceaux/BibleApi/wiki/Response-Types#bookresponse) (an array)
* A Single parameter can be passed, an object, containing `id` for `bibleId` with additional options. 
Here, all that's passed is the `bibleId` as a string.
```
async function doThings() {
  const books = await service.getBooks('06125adad2d5898a-01');

}
```

### Get all books from a Bible (with options)
* [Request Options](https://github.com/paceaux/BibleApi/wiki/Request-Parameters#booksrequestparam)
* [Response](https://github.com/paceaux/BibleApi/wiki/Response-Types#bookresponse) (an array)
* A Single parameter can be passed, an object, containing `id` for `bibleId` with additional options. 
`includeChapters` is an option that's passed in. 

```
async function doThings() {
  const books = await service.getBooks({ 
    id: '06125adad2d5898a-01'
    includeChapters: true,
    });

}
```


## Getting Chapters
About `chapterId`: 

1. Take the three-letter abbrevation (<samp> EXO</samp>) 
2. Add a `.` 
3. Then add the number 

e.g.
* Exodus 1 => <samp>EXO.1</samp>
* Mark 8 => <samp>MAR.8</samp>


### Get all chapters from a book
* [Request Options](https://github.com/paceaux/BibleApi/wiki/Request-Parameters#chaptersrequestparam)
* [Response](https://github.com/paceaux/BibleApi/wiki/Response-Types#ChapterSummaryResponse) (an array)
* A Single parameter can be passed, an object, containing `id` for `bibleId` and `bookId` with additional options. 


```
async function doThings() {
  const exodusChapters = await service.getChaptersFromBook('c315fa9f71d4af3a-01', 'EXO');
}
```


### Get one chapter
* [Request Options](https://github.com/paceaux/BibleApi/wiki/Request-Parameters#chaptersrequestparam)
* [Response](https://github.com/paceaux/BibleApi/wiki/Response-Types#ChapterResponse)
* A Single parameter can be passed, an object, containing `id` for `bibleId` and `chapterId` with additional options. 


```
async function doThings(){
  const chapter = service.getChapter('c315fa9f71d4af3a-01', 'EXO.1');
}
```

## Getting Verses
About `verseId`:

1. Take the `chapterId` (<samp> EXO.1</samp>) 
2. Add a `.` 
3. Then add the number 

e.g.
* Exodus 1:1 => <samp>EXO.1.1</samp>
* Mark 8:8 => <samp>MAR.8.8</samp>

### Get all verses from a chapter
* [Response](https://github.com/paceaux/BibleApi/wiki/Response-Types#versesummaryresponse) (as array)

Note that **this will not give you the content of the verses**. It may be useful, however, in getting `verseId`s

```
async function doThings(){
  const chapter = service.getVersesFromChapter('c315fa9f71d4af3a-01', 'EXO.1');
}
```

### Get one verse
* [Request Options](https://github.com/paceaux/BibleApi/wiki/Request-Parameters#VerseRequestParam)
* [Response](https://github.com/paceaux/BibleApi/wiki/Response-Types#verseresponse)
* A Single parameter can be passed, an object, containing `id` for `bibleId` and `verseId` with additional options. 


Note that **This only returns one verse**, for multiples you want a passage. 
```
async function doThings(){
  const chapter = service.getVerse('c315fa9f71d4af3a-01', 'EXO.1.1');
}
```

### Get Range of verses
* [Request Options](https://github.com/paceaux/BibleApi/wiki/Request-Parameters#PassageRequestParam)
* [Response](https://github.com/paceaux/BibleApi/wiki/Response-Types#passageresponse)

Note: This is an alias for `getPassage()`

```
async function doThings(){
  const chapter = service.getPassage('c315fa9f71d4af3a-01', 'EXO.1.1-EXO.1.20');
}
```


## Getting Passages
About `verseId`:

1. Take the `verseId` (<samp> EXO.1.1</samp>) 
2. Add a `-` 
3. Then add the `verseId` for the last verse

e.g.
* Exodus 1:1-20 => <samp>EXO.1.1-EXO.1.20</samp>
* Mark 8:8-14 => <samp>MAR.8.8-MAR.8.14</samp>


### Get one passage
* [Request Options](https://github.com/paceaux/BibleApi/wiki/Request-Parameters#PassageRequestParam)
* [Response](https://github.com/paceaux/BibleApi/wiki/Response-Types#passageresponse)
* A Single parameter can be passed, an object, containing `id` for `bibleId` and `passageId` with additional options. 


```
async function doThings(){
  const chapter = service.getPassage('c315fa9f71d4af3a-01', 'EXO.1.1-EXO.1.20');
}
```
