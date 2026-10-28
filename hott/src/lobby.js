/*
GET     /lobby/list            See games waiting for players
POST    /lobby/list            Create a new game
GET     /lobby/game/:gameId    Get the details of a specific game (this is polled by the host)
POST    /lobby/game/:gameId    Join a specific game
DELETE  /lobby/game/:gameId    Delete a specific game
*/

export function handleLobbyRequest (request, env){
    const url = new URL(request.url)
    const urlSplit = url.pathname.split('/')
    if (urlSplit[1] != "lobby"){
        return new Response("Internal Server Error", {
            status: 500
        })
    }
    const path = urlSplit[2]

    if (path == "list"){
        if (request.method == "GET"){
            return getGames(env)
        } else if (request.method == "POST"){
            return postGame(request, env)
        }
    } else if (path == "game"){
        const gameId = urlSplit[3]
        if (request.method == "GET"){
            return getGame(env, gameId)
        } else if (request.method == "POST"){
            return joinGame(request, env, gameId)
        } else if (request.method == "DELETE"){
            return deleteGame(env, gameId)
        }
    }
}

async function postGame(request, env){
    const url = new URL(request.url)
    const playerName = url.searchParams.get("name")
    if (!playerName){
        return new Response("No Player Name", { status: 400 })
    }

    const gameId = crypto.randomUUID()
    const {DB_LOBBY} = env

    // Create match record
    await DB_LOBBY.prepare(`INSERT INTO matches (match_id, left_score, right_score, active_team, pips, finished) VALUES (?,0,0,"left",0,0)`).bind(gameId).run()

    // Add 5 left players with initial positions (columns 0-4, random rows, avoid goal zone)
    const leftPositions = []
    while(leftPositions.length < 5){
        const x = Math.floor(Math.random()*5)
        const y = Math.floor(Math.random()*9)
        if (y < 2 || y > 6) continue
        leftPositions.push([x,y])
    }
    for (const [x,y] of leftPositions){
        const pid = crypto.randomUUID()
        await DB_LOBBY.prepare(`INSERT INTO players (player_id,team,x,y,standing,carried_ball,match_id) VALUES (?,?,?,?,1,NULL,?)`).bind(pid,"left",x,y,gameId).run()
    }

    // Add 5 right players columns 10-14
    const rightPositions=[]
    while(rightPositions.length<5){
        const x= Math.floor(Math.random()*5)+10
        const y= Math.floor(Math.random()*9)
        if (y<2||y>6) continue
        rightPositions.push([x,y])
    }
    for (const [x,y] of rightPositions){
        const pid=crypto.randomUUID()
        await DB_LOBBY.prepare(`INSERT INTO players (player_id,team,x,y,standing,carried_ball,match_id) VALUES (?,?,?,?,1,NULL,?)`).bind(pid,"right",x,y,gameId).run()
    }

    // Add 3 balls with spawn positions
    const balls=[{id:0,colour:"gold",sx:7,sy:2},{id:1,colour:"white",sx:7,sy:4},{id:2,colour:"purple",sx:7,sy:6}]
    for(const b of balls){
        await DB_LOBBY.prepare(`INSERT INTO balls (ball_id,colour,spawn_x,spawn_y,carrier_id,x,y,match_id) VALUES (?,?,?,?,NULL,?,?,?,?,?)`).bind(b.id,b.colour,b.sx,b.sy,b.sx,b.sy,gameId).run()
    }

    return Response.json({matchId:gameId})
}

async function getGames(env){
    const result = await env.DB_LOBBY
        .prepare(`
            SELECT id, player1, player2, status, created_at
            FROM games
            WHERE status = 'WAITING'
        `).all()
    return Response.json({
        games: result.results
    })
}

async function getGame(env, gameId){
    const game = await env.DB_LOBBY
        .prepare(`
            SELECT id, player1, player2, status, created_at
            FROM games
            WHERE id = ?
        `)
        .bind(gameId)
        .first()
    if (!game){
        return Response.json({
            error: "Game not found",
            status: 404
        })
    } else {
        return Response.json(game)
    }
}

async function deleteGame(request, env, gameId){
    const {DB_LOBBY} = env
    await DB_LOBBY.prepare(`DELETE FROM matches WHERE match_id = ?`).bind(gameId).run()
    await DB_LOBBY.prepare(`DELETE FROM players WHERE match_id = ?`).bind(gameId).run()
    await DB_LOBBY.prepare(`DELETE FROM balls WHERE match_id = ?`).bind(gameId).run()
    return Response.json({success:true})
}

async function joinGame(request, env, gameId){
    const url = new URL(request.url)
    const playerName = url.searchParams.get("name")
    if (!playerName){
        return new Response("No Player Name", { status: 400 })
    }
    const {DB_LOBBY} = env
    // For now we simply return success; real implementation would allocate a player to the right side if available
    return Response.json({gameId})
}
