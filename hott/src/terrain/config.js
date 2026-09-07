export const CONFIG = {
    table: {
        size: 24,
    },

    generation: {
        maxAttempts: 1_000,
        extraFeatures: {
        min: 2,
        max: 5,
        },
        roadChance: 0.4,
    },

    centralZone: {
        radius: 6,
        minimumBadFeatures: 2,
        minimumBadDiameter: 2,
    },

    validation: {
        minimumTerrainQuarters: 3,
        minimumBadQuarters: 2,
        maximumTerrainCoverage: 0.4,
    },
}