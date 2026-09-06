export default {

	async fetch (request) {
		const url = new URL(request.url)

		if (request.method == "GET" && url.pathname == "/api/hello") {
			const name = url.searchParams.get("name") ?? "World"

			return Response.json({
				message: `Hello ${name}`,
			})
		}

		return new Response("Not Found", {
			status: 404,
		})
	}

}