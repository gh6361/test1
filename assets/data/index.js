// data/index.js

// 1. Import all your individual cities
import { reykjavik } from './reykjavik.js';
import { helsinki } from './helsinki.js';
import { stockholm } from './stockholm.js';
import { pallas_Taivaskero } from './pallas_Taivaskero.js';
import { pallas_palkaskero } from './pallas_palkaskero.js';

// 2. Export them as one combined array for your map to use
export const locations = [
  reykjavik,
  helsinki,
  stockholm,
  pallas_Taivaskero,
  pallas_palkaskero
];