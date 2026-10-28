import {
    polygonsOverlap,
    polygonDistance,
} from "./geometry.js"

export function addFeatureWithoutOverlap(battlefield, generator, {attempts = 100, clearance = 1} = {}){
    for (let attempt = 0; attempt < attempts; attempt++){
        const feature = generator()

        if (!canPlaceFeature(feature, battlefield, clearance)){
            continue
        }

        battlefield.features.push(feature)
        return feature
    }

    return null
}

export function canPlaceFeature(feature, battlefield, clearance = 1){
    return battlefield.features.every((existingFeature) => !featuresTooClose(
            feature,
            existingFeature,
            clearance
        )
    )
}

export function featuresTooClose(first, second, clearance = 1){
    if (polygonsOverlap(first.points, second.points)){
        return true
    }

    return polygonDistance(first.points, second.points) < clearance
}