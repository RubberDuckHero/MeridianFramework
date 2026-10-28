// Arena Ball actions placeholder

export function dispatchAction(state, action) {
    // Very early stage – accept action structure and return updated state
    const { type, payload } = action;
    switch (type) {
        case 'MOVE':
            // Apply movement rules (to be implemented)
            break;
        case 'THROW':
            // Apply throw rules
            break;
        case 'CHALLENGE':
            // Handle steal or push
            break;
        case 'STAND':
            // Change standing state
            break;
        default:
            break;
    }
    return state;
}
