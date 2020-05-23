const titleFilterWords = require('../ref/title-filter-words.json');
const { withDB } = require('./db');

withDB(async (db) => {
  const collection = db.collection('search');
  const filterWordsRegex = new RegExp(`.*(${titleFilterWords.join('|')}).*`, 'i');
  const notYogaRegex = /^((?!yoga).)*$/i;

  const results1 = await collection
    .find(
      { 'snippet.title': filterWordsRegex },
      { projection: { 'snippet.title': 1 } },
    )
    .toArray();

  const results2 = await collection
    .find(
      { 'snippet.title': notYogaRegex },
      { projection: { 'snippet.title': 1 } },
    )
    .toArray();

  const allResults = results1.concat(results2);

  console.log(allResults.map((r) => r.snippet.title));

  const toDelete = allResults.map((r) => ({ _id: r._id }));
  const r = await Promise.all(toDelete.map((o) => collection.deleteOne(o)));
  const r2 = await Promise.all(toDelete.map((o) => db.collection('videos').deleteOne(o)));
  console.log('search', r.length);
  console.log('video', r2.length);

});
