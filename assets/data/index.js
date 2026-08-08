// data/index.js

// 1. Import all your individual cities
import { reykjavik } from './reykjavik.js';
import { helsinki } from './helsinki.js';
import { stockholm } from './stockholm.js';

// 2. Export them as one combined array for your map to use
export const locations = [
  reykjavik,
  helsinki,
  stockholm,
];