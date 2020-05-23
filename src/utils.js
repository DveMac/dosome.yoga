const notContains = (list) => (word) => list.indexOf(word) < 0;
const contains = (list) => (word) => list.indexOf(word) >= 0;

module.exports = { notContains, contains };
