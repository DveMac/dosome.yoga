const { withDB } = require('./db');

withDB(async (db) => {
  // const newVIdeos = db.collection('videos2') //.createIndex({ 'id': 1 }, { unique: true });
  // const records = await db.collection('videos').find().toArray();
  // console.log(`Found ${records.length}`);
  // const result = await newVIdeos.insertMany(records, { ordered: false });
  // console.log(`Stored ${result.ops.length}`);

  // db.collection('search').update({}, { $set: { query: '' } }, { upsert: false, multi: true });
});
