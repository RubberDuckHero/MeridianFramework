const CONFIG = {
    tableSize: 24,
    minimumTerrainQuarters: 3,
    minimumBadQuarters: 2,
    centralZoneRadius: 6,
    minimumCentralBadFeatures: 2,
    minimumCentralBadDiameter: 2,
    maximumTerrainCoverage: 0.40,
    extraFeatureCount: {
        min: 2,
        max: 5
    },
    maxGenerationAttempts: 1000
}

const TERRAIN_TYPES = {
    hill: {
        name: "Hill",
        terrainClass: "good",
        minWidth: 3,
        maxWidth: 7,
        minHeight: 2.5,
        maxHeight: 5,
    },

    woods: {
        name: "Woods",
        terrainClass: "bad",
        minWidth: 2,
        maxWidth: 5,
        minHeight: 2,
        maxHeight: 4.5,
    },

    field: {
        name: "Enclosed Field",
        terrainClass: "bad",
        minWidth: 2,
        maxWidth: 5,
        minHeight: 2,
        maxHeight: 4.5,
    },

    rocks: {
        name: "Rock Formation",
        terrainClass: "impassable",
        minWidth: 2,
        maxWidth: 4,
        minHeight: 2,
        maxHeight: 4,
    }

}

export function generateBattlefield() {
    for (let attempt = 0; attempt < CONFIG.maxGenerationAttempts; attempt++){

        const battlefield = {
            width: CONFIG.tableSize,
            height: CONFIG.tableSize,
            features: []
        }

        battlefield.features.push(generateCentralBadFeature())
        battlefield.features.push(generateCentralBadFeature())

        if (validateBattlefield(battlefield)){
            return battlefield
        }
    }
    throw new Error("Could not generate valid battlefield")
}

function validateBattlefield(battlefield){
    return true
}

function createFeature(type, x, y, width, height, rotation = 0){
    const definition = TERRAIN_TYPES[type]
    return {
        id: crypto.randomUUID(),
        type,
        terrainClass: definition.terrainClass,
        x,
        y,
        width,
        height,
        rotation
    }
}

function generateCentralBadFeature(){
    const type = randomChoice(["woods", "field"])
    const definition = TERRAIN_TYPES[type]
    const width = randomBetween(
        Math.max(
            definition.minWidth,
            CONFIG.minimumCentralBadDiameter
        ),
        definition.maxWidth,
        2
    )
    const height = randomBetween(
        Math.max(
            definition.minHeight,
            CONFIG.minimumCentralBadDiameter
        ),
        definition.maxHeight,
        2
    )

    const angle = randomBetween(
        0,
        Math.PI * 2,
        2
    )
    const distanceFromCenter = randomBetween(
        1.5,
        7,
        2
    )

    let x = 12 + Math.cos(angle) * distanceFromCenter
    let y = 12 + Math.sin(angle) * distanceFromCenter
    x = clamp(
        x,
        width / 2,
        CONFIG.tableSize - width / 2,
        2
    )
    y = clamp(
        y,
        height / 2,
        CONFIG.tableSize - height / 2,
        2
    )

    return createFeature(
        type,
        x,
        y,
        width,
        height,
        randomBetween(0,180,2)
    )
}

function randomBetween(min, max, scale = -1) {
    const value = min + Math.random() * (max - min)
    if (scale === -1) return value
    const factor = 10 ** scale
    return Math.round(value * factor) / factor
}

function randomChoice(array){
    return array[Math.floor(Math.random() * array.length)]
}

function clamp(value, min, max, scale = -1) {
    const clamped = Math.max(
        min,
        Math.min(max, value)
    )
    if (scale === -1) return clamped
    const factor = 10 ** scale
    return Math.round(clamped * factor) / factor
}
