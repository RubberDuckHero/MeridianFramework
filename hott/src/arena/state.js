// Arena Ball state management

export function createInitialState() {
    // Simple in-memory representation for now.
    // The real implementation will store this in a D1 database.
    return {
        matchId: null,
        teams: {
            left: null,
            right: null,
        },
        balls: [],
        scores: { left: 0, right: 0 },
        activeTeam: 'left',
        pips: 0,
        finished: false,
    };
}
