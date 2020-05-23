const fetch = require('node-fetch');
const qs = require('qs');
const { withDB } = require('./db');

const { notContains } = require('./utils');
const titleFilterWords = require('../ref/title-filter-words.json');

const ACCESS_TOKEN = 'AIzaSyAT_oGgo7ZLyyxavKzSlon2S3hOLWxN-DQ';

const search = async (q, pageToken) => {
  const opts = {
    key: ACCESS_TOKEN,
    part: 'id,snippet',
    q,
    maxResults: 50,
    type: 'video',
    videoDuration: 'medium',
    videoEmbeddable: true,
    relevanceLanguage: 'en',
    regionCode: 'US',
    publishedAfter: '2016-01-01T00:00:00Z',
  };
  if (typeof pageToken === 'string') opts.pageToken = pageToken;
  const query = qs.stringify(opts);
  const r = await fetch(`https://www.googleapis.com/youtube/v3/search?${query}`);
  const search = await r.json();
  return { items: search.items, nextPageToken: search.nextPageToken };
};

const videos = async (ids) => {
  const opts = {
    key: ACCESS_TOKEN,
    part: 'snippet,contentDetails,statistics',
    id: ids.join(),
  };
  const query = qs.stringify(opts);
  const r = await fetch(`https://www.googleapis.com/youtube/v3/videos?${query}`);
  const videos = await r.json();
  return videos.items || [];
};

const pause = async (timeout) => {
  return new Promise((r) => setTimeout(r, timeout));
};

const paged = async (q, maxPages, handleResults) => {
  let npt = true;
  let remain = maxPages;
  while (npt && remain-- > 0) {
    const { items, nextPageToken } = await search(q, npt);
    npt = nextPageToken;
    await handleResults(items);
    await pause(1000);
  }
  // await videos(ids);
};

const crawlSearch = (label, q, pages = 4) => async (db) => {
  await paged(q, pages, async (items) => {
    if (!items || !items.length) return;
    try {
      const collection = db.collection('search');
      const f = notContains(titleFilterWords);
      const filtered = items
        .filter((i) => f(i) && i.snippet.title.toLowerCase().indexOf('yoga') >= 0)
        .map((i) => ({ ...i, query: q, label }));
      console.log(`Found ${filtered.length}`);
      const result = await collection.insertMany(filtered, { ordered: false });
      console.log(`Stored ${result.ops.length}`);
    } catch (e) {
      console.log(e.result);
    }
  });
};

const getListOfUnscrapedVideoIds = async (db) => {
  debugger;
  const videos = await db.collection('videos').find({}, { id: 1 }).toArray();
  const videoIds = videos.map((v) => v.id);
  const search = await db
    .collection('search')
    .find({ 'id.videoId': { $nin: videoIds } }, { 'id.videoId': 1 })
    .toArray();
  return search.map((r) => r.id.videoId);
};

const scrapeVideoData = async (db) => {
  let err;
  while (!err) {
    try {
      const list = await getListOfUnscrapedVideoIds(db);
      const videoResults = await videos(list.slice(0, 25));
      console.log(`Found ${videoResults.length}`);
      const result = await db.collection('videos').insertMany(videoResults, { ordered: false });
      console.log(`Stored ${result.ops.length}`);
      await pause(300);
    } catch (e) {
      console.log(e);
      err = e;
    }
  }
};

withDB(async (db) => {
  const label = 'yoga';
  const negatives = '-meditation -challenge -prank -fail -kids -children -recipe';
  const query = `restorative yoga ${negatives}`;
  await crawlSearch(label, query)(db);
  await scrapeVideoData(db);
});
