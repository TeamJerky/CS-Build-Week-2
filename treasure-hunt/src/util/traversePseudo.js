// connect to server
// acquire Initial Response (First Attempt Usage)
// Start store Graph aka Map data in console, localstorage
// Send a Move Request by analyzing the current Response Room data
// Check the response from the Move Request, and update the Graph
// Now Keep running the loop until All Rooms are Map (While graph keys.length < 500)


import React from 'react'
import {axiosWithAuth} from './axiosAuth'
import { initGame } from '../data';

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
*/

const makeGraph = () =>{
    //Create our loop

    const graph = {}//Store the map

    //Initialize first room at current location
    let room = await initGame()//axios call to init
    // set the TIMER! (remember for live server)
    // add room to make room object in graph
    while(Object.keys(graph).length < 500){
        continue
        // put main logic here using helper functions
        // if room isn't in the graph, add room 
        // find valid exits 
        // if there are options, traverse
        // else use bfs to find another valid room
    }

    // console.log graph data 
    return(<>Lets Map that Graph</>)
}

//Add Room Helper

// graph = [{"room_id": 0, "room_name": "name", neighbors: {"n": "?", "s": "?", "e": "?", "w": "?"}}}]
function addRoom(data, graph){
    //Remove Fake Response Object when testing 
    let room = {...data}
        for (let i = 0; i < data.exits.length; i++){ //Response object contains, current room_id and exits which is array has exits
            room[i] = '?'
        }
    graph[data.room_id] = room
}

//Random 
function randomChoice(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
  }

// for ( let [key, value] of Object.entries(graph[data.room_id])){
// }

function validDirection(data){
    var a = ['a', 'b', 'c'];
    var iterator = a.entries();

    for (let e of iterator) {
    console.log(e);
    }
// [0, 'a']
// [1, 'b']
// [2, 'c']
    let options = []
    for (let direction of graph[data.room_id]){
        if (graph[data.room_id][direction] == '?'){
            options.push(direction)
        }    
    }
    if (options.length > 0){
        return randomChoice(options)
    }
    else{
        return null
    }
}

function bfs(starting_room){
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