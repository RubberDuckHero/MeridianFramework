export default {

	async fetch (request) {
		const url = new URL(request.url)

		if (request.method == "GET" && url.pathname == "/api/games"){
			return this.getGames(request)
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

	getGames(request){
		const url = new URL(request.url)
		return Response.json({
			game: 123,
			url: url.pathname
		})
	}

}