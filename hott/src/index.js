import {handleLobbyRequest} from "./lobby.js"

export default {

	async fetch (request, env) {
		const url = new URL(request.url)
		if (url.pathname.split('/')[0] == "lobby"){
			return handleLobbyRequest(request, env);
		}

		// // FETCH LOBBY
		// if (request.method == "GET" && url.pathname == "/lobby/games"){
		// 	return this.getGames(env)
		// }

		// // CREATE GAME
		// if (request.method == "POST" && url.pathname == "/lobby/games"){
		// 	return this.postGame(request, env)
		// }

		// // JOIN GAME
		// if (request.method == "POST"){
		// 	const isApiGameJoin = url.pathname.match(/^\/lobby\/([^/]+)\/join$/)
		// 	if (isApiGameJoin){
		// 		const gameId = isApiGameJoin[1]
		// 		return this.joinGame(request, env, gameId)
		// 	}
		// }

		// // GET SPECIFIC LOBBY GAME
		// if (request.method == "GET"){
		// 	const isApiGameGet = url.pathname.match(/^\/lobby\/games\/([^/]+)$/)
		// 	if (isApiGameGet){
		// 		const gameId = isApiGameGet[1]
		// 		return this.getGame(env, gameId)
		// 	}
		// }

		return new Response("Not Found", {
			status: 404,
		})
	},

	// POST	/games
	// GET	/games
	// GET	/games/:gameId
	// POST /games/:gameId/join

	async postGame(request, env){
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
	},

	async getGames(env){
		const result = await env.DB_LOBBY
			.prepare(`
				SELECT id, player1, player2, status, created_at
				FROM games
				WHERE status = 'WAITING'
			`).all()
		return Response.json({
			games: result.results
		})
	},

	async getGame(env, gameId){
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
	},

	async joinGame(request, env, gameId){
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

}