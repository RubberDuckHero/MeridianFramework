/*
GET     /armies/list           See all template army lists
*/

export function handleArmiesRequest (request, env){
    const url = new URL(request.url)
    const urlSplit = url.pathname.split('/')
    if (urlSplit[1] != "armies"){
        return new Response("Internal Server Error", {
            status: 500
        })
    }
    const path = urlSplit[2]

    if (path == "list"){
        if (request.method == "GET"){
            return getArmies()
        }
    }
}

function getArmies(){
    return Response.json({
        armies: [
            {
                id: '1',
                name: "Sindar",
                description: "1st age Grey Elves from Menegroth",
                units: [
                    {
                        type: "Hero",
                        general: true,
                        count: 1,
                        description: "Mablung or Beleg",
                    },{
                        type: "Hero",
                        general: false,
                        count: 1,
                        description: "Beleg or Turin",
                    },{
                        type: "Blades",
                        general: false,
                        count: 3,
                        description: "Elves with Axes",
                    },{
                        type: "Spears",
                        general: false,
                        count: 2,
                        description: "Elves with Spears",
                    },{
                        type: "Shooters",
                        general: false,
                        count: 3,
                        description: "Elves with Bows",
                    }
                ]
            },{
                id: '2',
                name: "Angband",
                description: "other armies",
                units: [
                    {
                        type: "Warband",
                        general: true,
                        count: 1,
                        description: "Orc Cheiftan and Guards",
                    },{
                        type: "Beasts",
                        general: false,
                        count: 3,
                        description: "Wolves",
                    },{
                        type: "Riders",
                        general: false,
                        count: 3,
                        description: "Orcs mounted on Wolves",
                    },{
                        type: "Hordes",
                        general: false,
                        count: 10,
                        description: "Orcs",
                    }
                ]
            },
        ]
    })
}