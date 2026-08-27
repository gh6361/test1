// data/index.js

// 1. Import all your individual cities
import { times } from './US/NYC/times.js';
import { E43 } from './US/NYC/E43.js';
import { pallas_Taivaskero } from './finland/pallas_Taivaskero.js';
import { pallas_palkaskero } from './finland/pallas_palkaskero.js';
import { oodi } from './finland/oodi.js';
import { Pyha_Luosto } from './finland/Pyha_Luosto.js';
import { reindeer } from './finland/reindeer.js';
import { swing } from './finland/swing.js'

// 2. Export them as one combined array for your map to use
export const locations = [
  times,
  E43,
  pallas_Taivaskero,
  pallas_palkaskero,
  oodi,
  Pyha_Luosto,
  reindeer,
  swing,
];