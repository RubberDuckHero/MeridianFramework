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
import { randomInt } from "./random.js";

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

function addExtraTerrain(battlefield) {
  const count = randomInt(
    CONFIG.generation.extraFeatures.min,
    CONFIG.generation.extraFeatures.max,
  );

  for (let i = 0; i < count; i++) {
    addFeatureWithoutOverlap(
      battlefield,
      generateRandomFeature,
    );
  }
}

function validateBattlefield(battlefield) {
  return (
    hasEnoughTerrainQuarters(battlefield) &&
    hasEnoughBadTerrainQuarters(battlefield) &&
    hasEnoughCentralBadFeatures(battlefield) &&
    isWithinMaximumTerrainCoverage(battlefield)
  );
}


function hasEnoughTerrainQuarters(battlefield) {
  const occupiedQuarters = getOccupiedQuarters(
    battlefield.features.filter(
      (feature) => feature.type !== "road",
    ),
  );

  return (
    occupiedQuarters.size >=
    CONFIG.validation.minimumTerrainQuarters
  );
}


function hasEnoughBadTerrainQuarters(battlefield) {
  const badFeatures = battlefield.features.filter(
    (feature) =>
      feature.terrainClass === "bad" ||
      feature.terrainClass === "impassable",
  );

  const occupiedQuarters =
    getOccupiedQuarters(badFeatures);

  return (
    occupiedQuarters.size >=
    CONFIG.validation.minimumBadQuarters
  );
}


function hasEnoughCentralBadFeatures(battlefield) {
  const center = CONFIG.table.size / 2;

  const count = battlefield.features.filter(
    (feature) => {
      if (feature.terrainClass !== "bad") {
        return false;
      }

      const distance = Math.hypot(
        feature.x - center,
        feature.y - center,
      );

      return (
        distance <= CONFIG.centralZone.radius
      );
    },
  ).length;

  return (
    count >=
    CONFIG.centralZone.minimumBadFeatures
  );
}


function isWithinMaximumTerrainCoverage(
  battlefield,
) {
  const tableArea =
    battlefield.width *
    battlefield.height;

  const terrainArea = battlefield.features
    .filter((feature) => feature.type !== "road")
    .reduce(
      (total, feature) =>
        total + polygonArea(feature.points),
      0,
    );

  return (
    terrainArea / tableArea <=
    CONFIG.validation.maximumTerrainCoverage
  );
}


function getOccupiedQuarters(features) {
  const center = CONFIG.table.size / 2;
  const quarters = new Set();

  for (const feature of features) {
    const horizontal =
      feature.x < center
        ? "left"
        : "right";

    const vertical =
      feature.y < center
        ? "top"
        : "bottom";

    quarters.add(
      `${vertical}-${horizontal}`,
    );
  }

  return quarters;
}


function polygonArea(points) {
  let area = 0;

  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next =
      points[(i + 1) % points.length];

    area +=
      current.x * next.y -
      next.x * current.y;
  }

  return Math.abs(area) / 2;
}