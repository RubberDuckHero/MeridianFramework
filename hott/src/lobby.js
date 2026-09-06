/*
GET     /lobby/list            See games waiting for players
POST    /lobby/list            Create a new game
GET     /lobby/game/:gameId    Get the details of a specific game (this is polled by the host)
POST    /lobby/game/:gameId    Join a specific game
DELETE  /lobby/game/:gameId    Delete a specific game
*/

export function handleLobbyRequest (request, env) {
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
    if (playerName == null){
        return new Response("No Player Name", {
            status: 400
        })
    }

    const gameId = crypto.randomUUID()
    await env.DB_LOBBY
        .prepare(`
            INSERT INTO games (id, player1, player2, status, created_at)
            VALUES (?, ?, NULL, 'WAITING', ?)
        `)
        .bind(gameId, playerName, Date.now())
        .run()
    return Response.json({
        gameId,
        player1: playerName,
        player2: null,
        status: "WAITING"
    })
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

async function deleteGame(env, gameId){
    await env.DB_LOBBY
        .prepare(`
            DELETE FROM games WHERE id = ?
        `)
        .bind(gameId)
        .run()
    return Response.json({
        success: true
    })
}

async function joinGame(request, env, gameId){
    const url = new URL(request.url)
    const playerName = url.searchParams.get("name")
    if (playerName == null){
        return new Response("No Player Name", {
            status: 400
        })
    }

    const result = await env.DB_LOBBY
        .prepare(`
            UPDATE games
            SET player2 = ?, status = 'READY'
            WHERE id = ?
                AND player2 IS NULL
                AND status = 'WAITING'
        `)
        .bind(playerName, gameId)
        .run()
            
    if (result.meta.changes === 0){
        return Response.json({
            error: "Game is not available",
            status: 409
        })
    } else {
        return Response.json({
            gameId
        })
    }
}