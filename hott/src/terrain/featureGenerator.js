import { CONFIG } from "./config.js";
import { TERRAIN_TYPES } from "./terrain.js";
import { generateShape } from "./shapeGenerator.js";
import {
  randomBetween,
  randomChoice,
  clamp,
} from "./random.js";

export function createFeature(type, options) {
  const terrain = TERRAIN_TYPES[type];

  const feature = {
    id: crypto.randomUUID(),
    type,
    terrainClass: terrain.terrainClass,
    ...options,
  };

  return {
    ...feature,
    points: generateShape({
      center: {
        x: feature.x,
        y: feature.y,
      },
      width: feature.width,
      height: feature.height,
      rotation: feature.rotation,
      shape: terrain.shape,
    }),
  };
}