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

        shape: {
            points: 12,
            irregularityMin: 0.88,
            irregularityMax: 1.08
        }
    },

    woods: {
        name: "Woods",
        terrainClass: "bad",
        minWidth: 2,
        maxWidth: 5,
        minHeight: 2,
        maxHeight: 4.5,

        shape: {
            points: 12,
            irregularityMin: 0.72,
            irregularityMax: 1.18
        }
    },

    field: {
        name: "Enclosed Field",
        terrainClass: "bad",
        minWidth: 2,
        maxWidth: 5,
        minHeight: 2,
        maxHeight: 4.5,

        shape: {
            points: -1,
        }
    },

    rocks: {
        name: "Rock Formation",
        terrainClass: "impassable",
        minWidth: 2,
        maxWidth: 4,
        minHeight: 2,
        maxHeight: 4,

        shape: {
            points: 7,
            irregularityMin: 0.65,
            irregularityMax: 1.15
        }
    },

    road: {
        name: "Road",
        terrainClass: "road",
        minWidth: 1,
        maxWidth: 1,
        minHeight: 0,
        maxHeight: 0,

        shape: {
            points: -1,
        }
    },

}

export function generateBattlefield() {
    for (let attempt = 0; attempt < CONFIG.maxGenerationAttempts; attempt++){

        const battlefield = {
            width: CONFIG.tableSize,
            height: CONFIG.tableSize,
            features: []
        }

        const roadRoll = randomInt(0, 100)
        if (roadRoll < 100){
            battlefield.features.push(generateRoad())
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
            //continue
        }

        const extraFeatureCount = randomInt(CONFIG.extraFeatureCount.min, CONFIG.extraFeatureCount.max)
        for (let i = 0; i < extraFeatureCount; i++){
            addFeatureWithoutOverlap(
                battlefield,
                generateRandomFeature
            )
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

function createFeature(
    type,
    x,
    y,
    width,
    height,
    rotation = 0
) {
    const definition = TERRAIN_TYPES[type]

    return {
        id: crypto.randomUUID(),
        type,
        terrainClass: definition.terrainClass,
        x,
        y,
        width,
        height,
        rotation,

        points: generateIrregularShape(
            x,
            y,
            width,
            height,
            rotation,
            definition.shape
        )
    }
}

function generateIrregularShape(
    centerX,
    centerY,
    width,
    height,
    rotation,
    {
        points = 10,
        irregularityMin = 0.8,
        irregularityMax = 1.15
    } = {}
) {
    const rotationRadians =
        rotation * Math.PI / 180

    // Special case: rectangle
    if (points === -1) {
        const halfWidth = width / 2
        const halfHeight = height / 2

        const corners = [
            { x: -halfWidth, y: -halfHeight },
            { x:  halfWidth, y: -halfHeight },
            { x:  halfWidth, y:  halfHeight },
            { x: -halfWidth, y:  halfHeight }
        ]

        return corners.map(point => {
            const rotatedX =
                point.x * Math.cos(rotationRadians) -
                point.y * Math.sin(rotationRadians)

            const rotatedY =
                point.x * Math.sin(rotationRadians) +
                point.y * Math.cos(rotationRadians)

            return {
                x: centerX + rotatedX,
                y: centerY + rotatedY
            }
        })
    }

    // Irregular shape
    const result = []

    for (let i = 0; i < points; i++) {
        const baseAngle =
            (i / points) * Math.PI * 2

        const angleStep =
            (Math.PI * 2) / points

        const angle =
            baseAngle +
            randomBetween(
                -angleStep * 0.2,
                angleStep * 0.2
            )

        const irregularity =
            randomBetween(
                irregularityMin,
                irregularityMax
            )

        const localX =
            Math.cos(angle) *
            (width / 2) *
            irregularity

        const localY =
            Math.sin(angle) *
            (height / 2) *
            irregularity

        const rotatedX =
            localX * Math.cos(rotationRadians) -
            localY * Math.sin(rotationRadians)

        const rotatedY =
            localX * Math.sin(rotationRadians) +
            localY * Math.cos(rotationRadians)

        result.push({
            x: centerX + rotatedX,
            y: centerY + rotatedY
        })
    }

    return result
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
        CONFIG.centralZoneRadius,
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

function generateRandomFeature(){
    const type = randomChoice(["woods", "field", "hill", "rocks"])
    const definition = TERRAIN_TYPES[type]
    return generateFeature(type, definition)
}

function generateRoad(){
    const type = "road"
    const definition = TERRAIN_TYPES[type]
    
    const width = randomBetween(
        definition.minWidth,
        definition.maxWidth,
        2
    )
    const height = CONFIG.tableSize * 4
    const x = randomBetween(
        width / 2,
        CONFIG.tableSize - width / 2
    )
    const y =  randomBetween(
        width / 2,
        CONFIG.tableSize - width / 2
    )

    return createFeature(
        type,
        x,
        y,
        width,
        height,
        randomBetween(0, 180, 2)
    )
}

function generateFeature(type, definition){
    const width = randomBetween(
        definition.minWidth,
        definition.maxWidth,
        2
    )
    const height = randomBetween(
        definition.minHeight,
        definition.maxHeight,
        2
    )
    const x = randomBetween(
        width / 2,
        CONFIG.tableSize - width / 2
    )
    const y = randomBetween(
        height / 2,
        CONFIG.tableSize - height / 2
    )

    return createFeature(
        type,
        x,
        y,
        width,
        height,
        randomBetween(0, 180, 2)
    )
}

function randomBetween(min, max, scale = -1) {
    const value = min + Math.random() * (max - min)
    if (scale === -1) return value
    const factor = 10 ** scale
    return Math.round(value * factor) / factor
}

function randomInt(min, max) {
    return Math.floor(
        randomBetween(min, max + 1)
    )
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

function canPlaceFeature(
    feature,
    battlefield,
    clearance = 1
) {
    for (const existing of battlefield.features) {
        if (
            featuresTooClose(
                feature,
                existing,
                clearance
            )
        ) {
            return false
        }
    }

    return true
}

function featuresTooClose(a, b, clearance = 1) {
    // If they actually overlap, they're definitely too close.
    if (polygonsOverlap(a.points, b.points)) {
        return true
    }

    const distance = polygonDistance(
        a.points,
        b.points
    )

    return distance < clearance
}

function polygonDistance(a, b) {
    let minimumDistance = Infinity

    for (let i = 0; i < a.length; i++) {
        const a1 = a[i]
        const a2 = a[(i + 1) % a.length]

        for (let j = 0; j < b.length; j++) {
            const b1 = b[j]
            const b2 = b[(j + 1) % b.length]

            const distance = segmentDistance(
                a1,
                a2,
                b1,
                b2
            )

            minimumDistance = Math.min(
                minimumDistance,
                distance
            )
        }
    }

    return minimumDistance
}

function segmentDistance(a1, a2, b1, b2) {
    if (segmentsIntersect(a1, a2, b1, b2)) {
        return 0
    }

    return Math.min(
        pointToSegmentDistance(a1, b1, b2),
        pointToSegmentDistance(a2, b1, b2),
        pointToSegmentDistance(b1, a1, a2),
        pointToSegmentDistance(b2, a1, a2)
    )
}

function pointToSegmentDistance(point, a, b) {
    const dx = b.x - a.x
    const dy = b.y - a.y

    const lengthSquared =
        dx * dx +
        dy * dy

    if (lengthSquared === 0) {
        return Math.hypot(
            point.x - a.x,
            point.y - a.y
        )
    }

    let t =
        (
            (point.x - a.x) * dx +
            (point.y - a.y) * dy
        ) / lengthSquared

    t = Math.max(
        0,
        Math.min(1, t)
    )

    const closestX =
        a.x + t * dx

    const closestY =
        a.y + t * dy

    return Math.hypot(
        point.x - closestX,
        point.y - closestY
    )
}