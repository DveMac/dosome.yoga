import { shuffle } from '../utils';
import adjectivesList from './assets/adjectives.json';
import animalsList from './assets/animals.json';

let animals = [];
let adjectives = [];
let numbers = [];

function genNumbers() {
  numbers.length = 0;
  numbers.push(0);
  // 1 is not plural, so we skip it
  for (let i = 2; i <= 1000; i += 1) {
    numbers.push(i);
  }

  return shuffle(numbers);
}

function random() {
  if (!adjectives.length) adjectives = shuffle(adjectivesList.slice(0));
  if (!animals.length) animals = shuffle(animalsList.slice(0));
  if (!numbers.length) numbers = shuffle(genNumbers());

  return `${adjectives.pop()}-${animals.pop()}-${numbers.pop()}`;
}

export default { random };
