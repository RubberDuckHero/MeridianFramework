// Arena entry point – dispatches to lobby or arena logic
import { handleLobbyRequest } from "./lobby.js";
import { handleArmiesRequest } from "./armies/armies.js";

import { generateBattlefield } from "./terrain/battlefield.js";

import { createInitialState, dispatchAction } from "./arena/state.js";

const arenaState = createInitialState();

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const pathParts = url.pathname.split("/");

        if (pathParts[1] === "lobby") {
            return handleLobbyRequest(request, env);
        }

        if (pathParts[1] === "armies") {
            return handleArmiesRequest(request, env);
        }

        if (pathParts[1] === "arena") {
            // Minimal arena routing
            const sub = pathParts[2] || "";
            if (sub === "start") {
                // Simple start – just set a dummy matchId
                arenaState.matchId = crypto.randomUUID();
                arenaState.finished = false;
                return Response.json({ matchId: arenaState.matchId });
            }

            if (sub === "state") {
                return Response.json(arenaState);
            }

            if (sub === "action") {
                const action = await request.json();
                const newState = dispatchAction(arenaState, action);
                return Response.json(newState);
            }
        }

        // Default fallback – return a generated battlefield
        if (true) {
            return Response.json({
                battlefield: generateBattlefield(),
            });
        }

        return new Response("Not Found", { status: 404 });
    },
};
