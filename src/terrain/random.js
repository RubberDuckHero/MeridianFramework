export function randomBetween(min, max, precision){
    const value = min + Math.random() * (max - min)

    if (precision === undefined){
        return value
    }

    return roundTo(value, precision)
}

export function randomInt(min, max){
    return Math.floor(randomBetween(min, max + 1))
}

export function randomChoice(items){
    return items[randomInt(0, items.length - 1)]
}

export function clamp(value, min, max, precision){
    const clamped = Math.max(min, Math.min(max, value))

    return precision === undefined
        ? clamped
        : roundTo(clamped, precision)
}

function roundTo(value, precision){
    const factor = 10 ** precision
    return Math.round(value * factor) / factor
}