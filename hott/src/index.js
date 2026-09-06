import {handleLobbyRequest} from "./lobby.js"
import { generateBattlefield } from "./terrain/terrainTypes.js";

export default {

	async fetch (request, env) {
		const url = new URL(request.url)
		if (url.pathname.split('/')[1] == "lobby"){
			return handleLobbyRequest(request, env);
		}

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