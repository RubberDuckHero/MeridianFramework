import { 
    CONFIG 
} from "./config.js"
import { 
    TERRAIN_TYPES 
} from "./terrain.js"
import {
    clamp,
    randomBetween,
    randomChoice,
} from "./random.js"
import { 
    generateShape 
} from "./shapeGenerator.js"


const RANDOM_TERRAIN_TYPES = [
    "woods",
    "field",
    "hill",
    "rocks",
]

const CENTRAL_BAD_TERRAIN_TYPES = [
    "woods",
    "field",
]

export function createFeature(type,{x, y, width, height, rotation = 0}){
    const definition = getTerrainDefinition(type)

    return {
        id: crypto.randomUUID(),

        type,
        terrainClass: definition.terrainClass,

        x,
        y,

        width,
        height,

        rotation,

        points: generateShape({
        center: { x, y },
        width,
        height,
        rotation,
        shape: definition.shape,
        }),
    }
}

export function generateRandomFeature(){
    const type = randomChoice(RANDOM_TERRAIN_TYPES)
    return generateFeature(type)
}

export function generateCentralBadFeature(){
    const type = randomChoice(CENTRAL_BAD_TERRAIN_TYPES)
    const definition = getTerrainDefinition(type)

    const { width, height } = randomSize(definition, {
        minimumWidth: CONFIG.centralZone.minimumBadDiameter,
        minimumHeight: CONFIG.centralZone.minimumBadDiameter
    })

    const tableCenter = CONFIG.table.size / 2

    const angle = randomBetween(
        0,
        Math.PI * 2
    )
    const distanceFromCenter = randomBetween(
        1.5,
        CONFIG.centralZone.radius,
        2
    )

    let x =
        tableCenter +
        Math.cos(angle) * distanceFromCenter
    let y =
        tableCenter +
        Math.sin(angle) * distanceFromCenter

    x = clamp(
        x,
        width / 2,
        CONFIG.table.size - width / 2,
        2
    )
    y = clamp(
        y,
        height / 2,
        CONFIG.table.size - height / 2,
        2
    )

    return createFeature(type, {
        x,
        y,
        width,
        height,
        rotation: randomRotation()
    })
}

export function generateRoad(){
    const type = "road"
    const definition = getTerrainDefinition(type)

    const width = randomBetween(
        ...definition.size.width,
        2
    )

    const height = CONFIG.table.size * 4

    const x = randomBetween(
        width / 2,
        CONFIG.table.size - width / 2
    )
    const y = randomBetween(
        width / 2,
        CONFIG.table.size - width / 2
    )

    return createFeature(type, {
        x,
        y,
        width,
        height,
        rotation: randomRotation()
    })
}

export function generateFeature(type){
    const definition = getTerrainDefinition(type)

    const { width, height } = randomSize(definition)

    const x = randomBetween(
        width / 2,
        CONFIG.table.size - width / 2
    )

    const y = randomBetween(
        height / 2,
        CONFIG.table.size - height / 2
    )

    return createFeature(type, {
        x,
        y,
        width,
        height,
        rotation: randomRotation()
    })
}

function randomSize(definition, {minimumWidth = 0, minimumHeight = 0} = {}){
    const [minWidth, maxWidth] = definition.size.width

    const [minHeight, maxHeight] = definition.size.height

    const width = randomBetween(
        Math.max(minWidth, minimumWidth),
        maxWidth,
        2
    )

    const height = randomBetween(
        Math.max(minHeight, minimumHeight),
        maxHeight,
        2
    )

    return {
        width,
        height
    }
}

function randomRotation(){
    return randomBetween(
        0,
        180,
        2
    )
}

function getTerrainDefinition(type){
    const definition = TERRAIN_TYPES[type]

    if (!definition){
        throw new Error(`Unknown terrain type: "${type}"`)
    }

    return definition
}