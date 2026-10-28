-- Schema for Arena Match storage in D1
-- Table: matches
-- Stores each game's state (teams, scores, active team, etc.)
CREATE TABLE IF NOT EXISTS matches (
    match_id TEXT PRIMARY KEY,
    left_score INTEGER NOT NULL DEFAULT 0,
    right_score INTEGER NOT NULL DEFAULT 0,
    active_team TEXT NOT NULL,
    pips INTEGER NOT NULL DEFAULT 0,
    finished INTEGER NOT NULL DEFAULT 0
);

-- Table: players
CREATE TABLE IF NOT EXISTS players (
    player_id TEXT PRIMARY KEY,
    team TEXT NOT NULL,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    standing INTEGER NOT NULL CHECK (standing IN (0,1)),
    carried_ball TEXT NULL,
    match_id TEXT NOT NULL,
    FOREIGN KEY (match_id) REFERENCES matches(match_id)
);

-- Table: balls
CREATE TABLE IF NOT EXISTS balls (
    ball_id TEXT PRIMARY KEY,
    colour TEXT NOT NULL,
    spawn_x INTEGER NOT NULL,
    spawn_y INTEGER NOT NULL,
    carrier_id TEXT NULL,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    match_id TEXT NOT NULL,
    FOREIGN KEY (match_id) REFERENCES matches(match_id)
);

-- Indexes for quick lookups
CREATE INDEX IF NOT EXISTS idx_players_match ON players (match_id);
CREATE INDEX IF NOT EXISTS idx_balls_match ON balls (match_id);
