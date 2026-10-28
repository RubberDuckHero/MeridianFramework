// Arena Ball state management

export function createInitialState(matchId = null) {
    // Simple in‑memory representation used for the prototype.  It contains
    // the minimal data required for a match: teams, players, balls and
    // state.  The structure matches the database schema closely.
    const leftPlayers = [];
    for (let i = 0; i < 5; i++) {
        leftPlayers.push({
            player_id: `L${i}-${matchId}`,
            team: 'left',
            x: i, // columns 0‑4
            y: 0,
            standing: 1,
            carried_ball: null,
            match_id: matchId,
        });
    }

    const rightPlayers = [];
    for (let i = 0; i < 5; i++) {
        rightPlayers.push({
            player_id: `R${i}-${matchId}`,
            team: 'right',
            x: 10 + i, // columns 10‑14
            y: 8,
            standing: 1,
            carried_ball: null,
            match_id: matchId,
        });
    }

    const balls = [
        { ball_id: '0', colour: 'Gold', spawn_x: 7, spawn_y: 2, carrier_id: null, x: 7, y: 2, match_id: matchId },
        { ball_id: '1', colour: 'White', spawn_x: 7, spawn_y: 4, carrier_id: null, x: 7, y: 4, match_id: matchId },
        { ball_id: '2', colour: 'Purple', spawn_x: 7, spawn_y: 6, carrier_id: null, x: 7, y: 6, match_id: matchId },
    ];

    return {
        matchId,
        teams: {
            left: leftPlayers,
            right: rightPlayers,
        },
        balls,
        scores: { left: 0, right: 0 },
        activeTeam: 'left',
        pips: 0,
        finished: false,
    };
}
