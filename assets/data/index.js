// data/index.js

// 1. Import all your individual cities
import { broadway } from './US/NYC/broadway.js';
import { pigeon } from './US/NYC/pigeon.js';
import { dog } from './US/NYC/dog.js';
import { highline } from './US/NYC/highline.js';
import { lincoln } from './US/NYC/lincoln.js';
import { met } from './US/NYC/met.js';
import { pier } from './US/NYC/pier.js';
import { katz } from './US/NYC/katz.js';
import { brooklyn } from './US/NYC/brooklyn.js';
import { honeycomb } from './US/NYC/honeycomb.js';
import { times } from './US/NYC/times.js';
import { pallas_Taivaskero } from './finland/pallas_Taivaskero.js';
import { pallas_palkaskero } from './finland/pallas_palkaskero.js';
import { oodi } from './finland/oodi.js';
import { Pyha_Luosto } from './finland/Pyha_Luosto.js';
import { reindeer } from './finland/reindeer.js';
import { swing } from './finland/swing.js'

// 2. Export them as one combined array for your map to use
export const locations = [
  broadway,
  pigeon,
  dog,
  highline,
  lincoln,
  met,
  pier,
  katz,
  brooklyn,
  honeycomb,
  times,
  pallas_Taivaskero,
  pallas_palkaskero,
  oodi,
  Pyha_Luosto,
  reindeer,
  swing,
];