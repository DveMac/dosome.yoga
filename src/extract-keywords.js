const { notContains } = require('./utils');
const stopWords = require('../ref/stop-words.json').map((s) => s.toLowerCase());
const { withDB } = require('./db');

const doesNotContainStopWord = notContains(stopWords);
const flatten = (aOfas) => aOfas.reduce((m, v) => m.concat(v), []);

const getSortedOccurances = (list) => {
  const occurances = list.reduce((m, v) => {
    if (!m[v]) m[v] = 1;
    else m[v] += 1;
    return m;
    j;
  }, {});

  return Object.entries(occurances).sort((a, b) => b[1] - a[1]);
};

const cleanString = (str) =>
  str
    .toLowerCase()
    .replace(/[^\w-\.]/g, ' ')
    .replace(/\.\s/g, ' ')
    .replace(/\.{3}/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .split(' ')
    .filter((t) => t.length > 2)
    .filter(doesNotContainStopWord)
    .join(' ')
    .trim();

const parseForKeywords = (stringList) => {
  return stringList.map((str) => ({
    keywords: cleanString(str).split(' '),
    source: str,
  }));
};

const topKeywordsFromTitles = (count = 100) => async (db) => {
  const search = await db.collection('video').find({}, { 'snippet.title': 1 }).toArray();

  const titles = search.map((s) => s.snippet.title);
  const keywordsPerSource = parseForKeywords(titles);
  const keywords = flatten(keywordsPerSource.map((x) => x.keywords));

  const occurances = getSortedOccurances(keywords);
  return occurances.slice(0, count);
};

const topKeywordsFromTags = (count = 100) => async (db) => {
  const search = await db.collection('videos').find({}, { 'snippet.tags': 1 }).toArray();
  debugger;
  const videoTags = search.map((s) => s.snippet.tags).filter(Boolean);
  const cleanedVideoTags = videoTags.map((list) => [
    ...new Set(list.map(cleanString).filter(Boolean)),
  ]);
  const flattened = flatten(cleanedVideoTags);
  const occurances = getSortedOccurances(flattened);
  return occurances.slice(0, count);
  // const keywords = flatten(keywordsPerSource.map((x) => x.keywords));

  // const occurances = keywords.reduce((m, v) => {
  //   if (!m[v]) m[v] = 1;
  //   else m[v] += 1;
  //   return m;
  //   j;
  // }, {});

  // const x = Object.entries(occurances).sort((a, b) => b[1] - a[1]);
  // const r = x.slice(0, count);
  // return r;
};

const keywordUsage = (k) => async (db) => {
  const search = await db.collection('videos').find({}, { 'snippet.title': 1, 'snippet.description': 1 }).toArray();
  const titles = search.map((s) => s.snippet.title);
  const keywordsPerSource = parseForKeywords(titles);
  const keywordUsage = keywordsPerSource.filter((x) => x.keywords.indexOf(k) >= 0).map((x) => x.source);

  return keywordUsage;
};

const unmappedKeywords = (mappings) => async (db) => {
  const search = await db.collection('videos').find({}, { 'snippet.title': 1 }).toArray();
  const allTitles = search.map((s) => s.snippet.title);
  const topKeywordsList = await topKeywordsFromTitles(10000)(db);
  const mappedKeyphrases = flatten(Object.values(mappings));
  const allTitlesKeywords = [...new Set(flatten(parseForKeywords(allTitles)))];
  const unmapped = allTitlesKeywords.filter((value) => !mappedKeyphrases.includes(value));
  const ordered = unmapped
    .slice(0, 50)
    .map((w) => topKeywordsList.find((x) => x[0] === w))
    .sort((a, b) => b[1] - a[1]);
  return ordered;
};

const mappings = {
  core: ['core', 'abs', 'lower abs'],
  'lower back': ['lower back'],
  butt: ['butt'],
  'back pain': ['back reflief', 'back pain relief', 'siatica'],
  'upper body': ['upper body'],
  'full body': ['full body', 'total body', 'body'],
  wrists: ['wrists', 'wrist'],
  shoulders: ['shoulders', 'shoulder', 'shoulder pain', 'shoulder stretch'],
  legs: ['legs', 'leg', 'lower body'],
  arms: ['arms'],
  hip: ['hip', 'hips'],
  knee: ['knee', 'knees', 'knee pain'],

  balance: ['balance'],
  flexibility: ['flexibility', 'flexible', 'flexibility exercises'],
  stretch: ['stretch', 'streching', 'stretches', 'dynamic stretching', 'static stretching'],
  breath: ['breath', 'breathing'],

  quick: ['quick', 'fast', 'quickie', 'short', 'quickies'],
  beginner: ['beginner', 'beginners', 'easy', 'simple'],
  intense: ['hiit', 'intense', 'sweaty'],

  'weight loss': ['fat burning', 'weight loss'],
  relax: ['relaxing', 'anger release', 'relax', 'wind-down', 'chill', 'relaxation', 'calming'],
  'stress & anxiety': ['stress relief', 'stress', 'anxiety'],
  'pain relief': ['pain relief', 'pain'],

  vinyasa: ['vinyasa', 'vinyasa flow'],
  ashtanga: ['ashtanga'],
  prenatal: ['prenatal'],
  couples: ['couples'],
  hatha: ['hatha'],
  restorative: ['restorative'],

  morning: ['morning', 'sunrise', 'wake up', 'wake-up'],
  evening: ['evening', 'sleep', 'bedtime'],

  female: ['female', 'girl', 'girls'],
  male: ['male', 'boy', 'boys', 'guys'],
};

const log = (fn) => async (...args) => {
  const r = await fn(...args);
  console.log(r);
};

// withDB(log(unmappedKeywords(mappings)));
// withDB(log(keywordUsage('poses')));
withDB(log(topKeywordsFromTitles()));
