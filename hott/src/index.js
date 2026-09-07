import {handleLobbyRequest} from "./lobby.js"
import { generateBattlefield } from "./terrain/battlefield.js"

export default {

	async fetch (request, env){
		const url = new URL(request.url)
		if (url.pathname.split('/')[1] == "lobby"){
			return handleLobbyRequest(request, env)
		}

		// Testing if nothing else send a new battlefield
		if (true){
			return Response.json({
				battlefield: generateBattlefield()
			})
		}

		return new Response("Not Found", {
			status: 404,
		})
	},

}