import {handleLobbyRequest} from "./lobby.js"

export default {

	async fetch (request, env) {
		const url = new URL(request.url)
		if (url.pathname.split('/')[1] == "lobby"){
			return handleLobbyRequest(request, env);
		}

		return new Response("Not Found", {
			status: 404,
		})
	},

}