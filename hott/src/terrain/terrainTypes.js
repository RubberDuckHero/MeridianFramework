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

        const first = addFeatureWithoutOverlap(
            battlefield,
            generateCentralBadFeature
        )

        const second = addFeatureWithoutOverlap(
            battlefield,
            generateCentralBadFeature
        )

        if (!first || !second) {
            continue
        }

        if (validateBattlefield(battlefield)){
            return battlefield
        }
    }
    throw new Error("Could not generate valid battlefield")
}

function validateBattlefield(battlefield){
    return true
}

function addFeatureWithoutOverlap(
    battlefield,
    generator,
    attempts = 100
) {
    for (let attempt = 0; attempt < attempts; attempt++) {
        const feature = generator()

        if (canPlaceFeature(feature, battlefield)) {
            battlefield.features.push(feature)
            return feature
        }
    }

    return null
}

function createFeature(type, x, y, width, height, rotation = 0){
    const definition = TERRAIN_TYPES[type]
    let numPoints = 10
    if (type === "rocks") numPoints = 7
    if (type === "field") numPoints = 4
    const points = generateIrregularShape(
        x,
        y,
        width,
        height,
        rotation,
        numPoints
    )

    return {
        id: crypto.randomUUID(),
        type,
        terrainClass: definition.terrainClass,
        x,
        y,
        width,
        height,
        rotation,
        points
    }
}

function generateIrregularShape(
    centerX,
    centerY,
    width,
    height,
    rotation = 0,
    pointCount = 10
) {
    const points = []

    const rotationRadians = rotation * Math.PI / 180

    for (let i = 0; i < pointCount; i++) {
        const angle =
            (i / pointCount) * Math.PI * 2

        // Randomly push each point inward/outward.
        // Keep the range fairly restrained or you'll get crazy shapes.
        const irregularity = randomBetween(0.75, 1.15)

        const radiusX =
            (width / 2) * irregularity

        const radiusY =
            (height / 2) * irregularity

        let localX = Math.cos(angle) * radiusX
        let localY = Math.sin(angle) * radiusY

        // Rotate the point.
        const rotatedX =
            localX * Math.cos(rotationRadians) -
            localY * Math.sin(rotationRadians)

        const rotatedY =
            localX * Math.sin(rotationRadians) +
            localY * Math.cos(rotationRadians)

        points.push({
            x: centerX + rotatedX,
            y: centerY + rotatedY
        })
    }

    return points
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

function polygonsOverlap(a, b) {
    // Check edge intersections.
    for (let i = 0; i < a.length; i++) {
        const a1 = a[i]
        const a2 = a[(i + 1) % a.length]

        for (let j = 0; j < b.length; j++) {
            const b1 = b[j]
            const b2 = b[(j + 1) % b.length]

            if (segmentsIntersect(a1, a2, b1, b2)) {
                return true
            }
        }
    }

    // One polygon might be completely inside the other.
    if (pointInPolygon(a[0], b)) {
        return true
    }

    if (pointInPolygon(b[0], a)) {
        return true
    }

    return false
}

function segmentsIntersect(a, b, c, d) {
    const orientation = (p, q, r) => {
        return (
            (q.y - p.y) * (r.x - q.x) -
            (q.x - p.x) * (r.y - q.y)
        )
    }

    const o1 = orientation(a, b, c)
    const o2 = orientation(a, b, d)
    const o3 = orientation(c, d, a)
    const o4 = orientation(c, d, b)

    return (
        ((o1 > 0 && o2 < 0) || (o1 < 0 && o2 > 0)) &&
        ((o3 > 0 && o4 < 0) || (o3 < 0 && o4 > 0))
    )
}

function pointInPolygon(point, polygon) {
    let inside = false

    for (
        let i = 0, j = polygon.length - 1;
        i < polygon.length;
        j = i++
    ) {
        const a = polygon[i]
        const b = polygon[j]

        const intersects =
            ((a.y > point.y) !== (b.y > point.y)) &&
            (
                point.x <
                ((b.x - a.x) *
                    (point.y - a.y)) /
                    (b.y - a.y) +
                    a.x
            )

        if (intersects) {
            inside = !inside
        }
    }

    return inside
}

function canPlaceFeature(feature, battlefield) {
    for (const existing of battlefield.features) {
        if (
            polygonsOverlap(
                feature.points,
                existing.points
            )
        ) {
            return false
        }
    }

    return true
}