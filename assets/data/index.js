// data/index.js

// 1. Import all your individual cities
import { reykjavik } from './reykjavik.js';
import { pallas_Taivaskero } from './finland/pallas_Taivaskero.js';
import { pallas_palkaskero } from './finland/pallas_palkaskero.js';
import { oodi } from './finland/oodi.js';
import { Pyha_Luosto } from './finland/Pyha_Luosto.js';
import { reindeer } from './finland/reindeer.js';
import { swing } from './finland/swing.js'

// 2. Export them as one combined array for your map to use
export const locations = [
  reykjavik,
  pallas_Taivaskero,
  pallas_palkaskero,
  oodi,
  Pyha_Luosto,
  reindeer,
  swing
];