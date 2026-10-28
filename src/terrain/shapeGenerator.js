import { 
    randomBetween 
} from "./random.js";


export function generateShape({center, width, height, rotation = 0, shape}){
    switch (shape.type){
    case "rectangle":
        return generateRectangle(
            center,
            width,
            height,
            rotation
        )

    case "irregular":
        return generateIrregularPolygon(
            center,
            width,
            height,
            rotation,
            shape
        )

    default:
        throw new Error(`Unknown shape type: "${shape.type}"`)
    }
}


function generateRectangle(center, width, height, rotation){
    const halfWidth = width / 2
    const halfHeight = height / 2

    const corners = [
        { x: -halfWidth, y: -halfHeight },
        { x: halfWidth, y: -halfHeight },
        { x: halfWidth, y: halfHeight },
        { x: -halfWidth, y: halfHeight }
    ]

    return transformPoints(
        corners,
        center,
        rotation
    )
}


function generateIrregularPolygon(center, width, height, rotation, {points = 10, irregularity = [0.8, 1.15]} = {}){
    const [irregularityMin, irregularityMax] = irregularity;

    const result = [];

    const angleStep = (Math.PI * 2) / points;

    for (let i = 0; i < points; i++){
        const baseAngle = (i / points) * Math.PI * 2

        const angle =
            baseAngle +
            randomBetween(
                -angleStep * 0.2,
                angleStep * 0.2
            )

        const scale = randomBetween(
            irregularityMin,
            irregularityMax
        )

        result.push({
            x:
                Math.cos(angle) *
                (width / 2) *
                scale,
            y:
                Math.sin(angle) *
                (height / 2) *
                scale,
        })
    }

    return transformPoints(
        result,
        center,
        rotation
    )
}


function transformPoints(points, center, rotation){
    const radians = degreesToRadians(rotation)

    return points.map((point) => {
        const rotated = rotatePoint(
            point,
            radians
        )

        return {
            x: center.x + rotated.x,
            y: center.y + rotated.y
        }
    })
}


function rotatePoint({ x, y }, radians){
    return {
        x:
            x * Math.cos(radians) -
            y * Math.sin(radians),

        y:
            x * Math.sin(radians) +
            y * Math.cos(radians)
    }
}


function degreesToRadians(degrees){
    return degrees * Math.PI / 180
}