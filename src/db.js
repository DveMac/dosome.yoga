const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://admin:pass@localhost:27010';
const dbName = '10my';
const client = new MongoClient(url);

const withDB = async (func) => {
  client.connect(async (err) => {
    assert.equal(null, err);
    console.log('Connected successfully to server');

    const db = client.db(dbName);
    await func(db);
    client.close();
  });
}

module.exports = { withDB };
