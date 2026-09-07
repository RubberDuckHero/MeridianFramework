import { CONFIG } from "./config.js";
import {
    generateCentralBadFeature,
    generateRandomFeature,
    generateRoad,
} from "./featureGenerator.js";
import { 
    canPlaceFeature, 
    addFeatureWithoutOverlap 
} from "./placement.js";
import { randomBetween } from "./random.js";

export function generateBattlefield(){
  for (let attempt = 0;
        attempt < CONFIG.generation.maxAttempts;
        attempt++){
    const battlefield = createBattlefield();

    maybeAddRoad(battlefield);

    if (!addRequiredCentralTerrain(battlefield)){
      continue;
    }

    addExtraTerrain(battlefield);

    if (validateBattlefield(battlefield)){
      return battlefield;
    }
  }

  throw new Error("Could not generate valid battlefield");
}

function createBattlefield() {
  return {
    width: CONFIG.table.size,
    height: CONFIG.table.size,
    features: [],
  };
}

function maybeAddRoad(battlefield) {
  if (Math.random() >= CONFIG.generation.roadChance) {
    return;
  }

  addFeatureWithoutOverlap(
    battlefield,
    generateRoad,
  );
}

function addRequiredCentralTerrain(battlefield) {
  for (
    let i = 0;
    i < CONFIG.centralZone.minimumBadFeatures;
    i++
  ) {
    const feature = addFeatureWithoutOverlap(
      battlefield,
      generateCentralBadFeature,
    );

    if (!feature) {
      return false;
    }
  }

  return true;
}