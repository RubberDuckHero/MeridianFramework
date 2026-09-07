export const TERRAIN_TYPES = {
  hill: {
    name: "Hill",
    terrainClass: "good",
    size: {
      width: [3, 7],
      height: [2.5, 5],
    },
    shape: {
      type: "irregular",
      points: 12,
      irregularity: [0.88, 1.08],
    },
  },

  woods: {
    name: "Woods",
    terrainClass: "bad",
    size: {
      width: [2, 5],
      height: [2, 4.5],
    },
    shape: {
      type: "irregular",
      points: 12,
      irregularity: [0.72, 1.18],
    },
  },

  field: {
    name: "Enclosed Field",
    terrainClass: "bad",
    size: {
      width: [2, 5],
      height: [2, 4.5],
    },
    shape: {
      type: "rectangle",
    },
  },

  rocks: {
    name: "Rock Formation",
    terrainClass: "impassable",
    size: {
      width: [2, 4],
      height: [2, 4],
    },
    shape: {
      type: "irregular",
      points: 7,
      irregularity: [0.65, 1.15],
    },
  },

  road: {
    name: "Road",
    terrainClass: "road",
    size: {
      width: [1, 1],
    },
    shape: {
      type: "rectangle",
    },
  },
};