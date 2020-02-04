
const graph = {}
const traversal_path = [];

/*
{"room_id": 0,
"title": "A brightly lit room",
"description": "You are standing in the center of a brightly lit room. You notice a shop to the west and exits to the north, south and east.",
"coordinates": "(60,60)",
"elevation": 0,
"terrain": "NORMAL",
"players": [],
"items": ["boots", "jacket"],
"exits": ["n", "s", "e", "w"],
"cooldown": 1.0,
"errors": [],
"messages": []}

Now you send request to move North

The response sent:

{"room_id": 1,
"title": "Shop",
"description": "You are standing in a small shop. A sign behind the mechanical shopkeeper says 'WILL PAY FOR TREASURE'.",
"coordinates": "(59,60)",
"elevation": 0,
"terrain": "NORMAL",
"players": [],
"items": ["tiny treasure"],
"exits": ["e"],
"cooldown": 60.0,
"errors": [],
"messages": ["You have walked west."]}


*/

function add_room(){
    //Remove Fake Response Object when testing 
    fakeResponseObject = {room_id:2,exits:["e","s"]}
    let room = {}
        for (let i = 0; i < fakeResponseObject.exits.length;i++){ //Response object contains, current room_id and exits which is array has exits
            room[i] = '?'
        }
    graph[fakeResponseObject.room_id] = room
}

//Random 
function randomChoice(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
  }

function valid_direction(room){
    let options = []
    let current_direction = null
    for (let direction in graph[room.id]){
        if (graph[room.id][direction] == '?'){
            options.push(direction)
        }    
    }
    if (traversal_path.length > 0){
        current_direction = traversal_path[traversal_path.length - 1]
    }
    if (options.length > 0){
        return randomChoice(options)
    }
    else{
        return null
    }
}

const opposite_direction = {'s':'n', 'n':'s', 'e':'w', 'w':'e'}

function convert_path(path) {
    const room_ids = [];
    const directions = [];
    let next_room = null;
    // Array of objects
    path.forEach(room => {
        room_ids.push(room.id)
    })

    for(let i = 0; i < rooms_id.length; i++) {
    }

    // for ( let [index, item] in array.entries()){
    // }
    return directions;
}

def convert_path(path):
    room_ids = []
    directions = []
    next_room = None
    for room in path:
        room_ids.append(room.id)

    for i, room_id in enumerate(room_ids):
        if i < len(room_ids) - 1:
            next_room = room_ids[i+1]
        direction = [dir for dir, room in graph[room_id].items()
                     if room == next_room]
        if len(direction) > 0:
            directions.append(direction[0])
    return directions

function find_shortest_path(starting_room){
    const queue = []
    queue.push([starting_room])
    const visited = Set()
    while(queue.length > 0){
        let path = queue.pop()
        let room = path[path.length-1]
        if(valid_direction(room) !== null){
            return convert_path(path)
        }
        if(!visited.includes(room.id)){
            visited.push(room.id)
            for(let dir in graph[room.id]){
                let new_room = room.get_room_in_direction(direction)
                let new_path = path + [new_room]
                queue.pop(new_path)
            }
        }
    }

}


const traverse = () => {
    
    if(graph.length == 0){
        add_room()
    }

    while (Object.keys(graph).length < room_graph.length){
        let original_room = player.current_room.id
        let direction = valid_direction(player.current_room)

        // if direction is not None:
        if(direction){
            player.travel(direction)
            traversal_path.append(direction)
            graph[original_room][direction] = player.current_room.id

            // if player.current_room.id not in graph:
            if (!graph.includes(player.current_room.id))
                let path = find_shortest_path(player.current_room)
                for (let d in path){
                    player.travel(d)
                    traversal_path.append(d)
                }
                
        } else{ 
            add_room();
            graph[player.current_room.id][opposite_direction[direction]] = original_room
        }
            
    }
        
}
    


