export function polygonsOverlap(a, b){
    for (let i = 0; i < a.length; i++){
        const a1 = a[i]
        const a2 = a[(i + 1) % a.length]
        
        for (let j = 0; j < b.length; j++){
            const b1 = b[j]
            const b2 = b[(j + 1) % b.length]
            
            if (segmentsIntersect(a1, a2, b1, b2)){
                return true
            }
        }
    }
    
    if (pointInPolygon(a[0], b)){
        return true
    }
    
    if (pointInPolygon(b[0], a)){
        return true
    }
    
    return false
}

export function polygonDistance(a, b){
    let minimumDistance = Infinity
    
    for (let i = 0; i < a.length; i++){
        const a1 = a[i]
        const a2 = a[(i + 1) % a.length]
        
        for (let j = 0; j < b.length; j++){
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

function segmentsIntersect(a, b, c, d){
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

function pointInPolygon(point, polygon){
    let inside = false
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++){
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
        
        if (intersects){
            inside = !inside
        }
    }
    
    return inside
}

function segmentDistance(a1, a2, b1, b2){
    if (segmentsIntersect(a1, a2, b1, b2)){
        return 0
    }
    
    return Math.min(
        pointToSegmentDistance(a1, b1, b2),
        pointToSegmentDistance(a2, b1, b2),
        pointToSegmentDistance(b1, a1, a2),
        pointToSegmentDistance(b2, a1, a2)
    )
}

function pointToSegmentDistance(point, a, b){
    const dx = b.x - a.x
    const dy = b.y - a.y
    
    const lengthSquared = dx * dx + dy * dy
    
    if (lengthSquared === 0){
        return Math.hypot(
            point.x - a.x,
            point.y - a.y
        )
    }
    
    let t = (
            (point.x - a.x) * dx +
            (point.y - a.y) * dy
        ) / lengthSquared
    
    t = Math.max(
        0,
        Math.min(1, t)
    )
    
    const closestX = a.x + t * dx
    
    const closestY = a.y + t * dy
    
    return Math.hypot(
        point.x - closestX,
        point.y - closestY
    )
}

export function polygonArea(points){
    let area = 0
    
    for (let i = 0; i < points.length; i++){
        const current = points[i]
        const next =
        points[(i + 1) % points.length]
        
        area += current.x * next.y - next.x * current.y
    }
    
    return Math.abs(area) / 2
}