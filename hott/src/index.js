export default {

	async fetch (request, env) {
		const url = new URL(request.url)

		if (request.method == "GET" && url.pathname == "/api/games"){
			return this.getGames(env)
		}

		if (request.method == "POST" && url.pathname == "/api/games"){
			return this.postGame(env)
		}

		if (request.method == "GET" && url.pathname == "/api/hello") {
			const name = url.searchParams.get("name") ?? "World"

			return Response.json({
				message: `Hello ${name}`,
			})
		}

		return new Response("Not Found", {
			status: 404,
		})
	},

	// POST	/games
	// GET	/games
	// GET	/games/:gameId
	// POST /games/:gameId/join

	async postGame(env){
		const gameId = crypto.randomUUID()
		await env.DB_LOBBY
			.prepare(`
				INSERT INTO games (id, player1, player2, status, create_at)
				VALUES (?, ?, NULL, 'WAITING', ?)
			`)
			.bind(gameId, 'Apple', Date.now())
			.run()
		return Response.json({
			gameId: gameId
		})
	},

	async getGames(env){
		const gamesList = await env.DB_LOBBY
			.prepare(`
				SELECT id, player1, player2, status, created_at
				FROM games
				WHERE status = 'WAITING'
			`).all()
		return Response.json({
			game: 123,
			games: gamesList.results
		})
	},

}