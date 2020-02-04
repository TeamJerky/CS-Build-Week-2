// connect to server
// acquire Initial Response (First Attempt Usage)
// Start store Graph aka Map data in console, localstorage
// Send a Move Request by analyzing the current Response Room data
// Check the response from the Move Request, and update the Graph
// Now Keep running the loop until All Rooms are Map (While graph keys.length < 500)
import React from "react";
import { axiosWithAuth } from "../util/axiosAuth";
import { initGame } from "../data";

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

export const move = direction => {
  let command = { direction: direction };
  return axiosWithAuth()
    .post("move/", command)
    .then(res => {
      console.log(res.data);
      return res.data;
    })
    .catch(err => console.log("error", err.response));
};

const opposite_direction = { s: "n", n: "s", e: "w", w: "e" };

export const makeGraph = async () => {
  const graph = {}; //Store the map

  //Initialize first room at current location
  let room = await initGame();
  let prev_room;

  while (Object.keys(graph).length < 500) {
    wait(room.cooldown);
    if (!graph[room]) {
      addRoom(room, graph);
    }

    // find valid exits
    let direction = validDirection(graph[room.room_id], graph);
    // if there are options, traverse
    // create a post request to move
    if (direction) {
      prev_room = room;
      room = await move(direction);
      console.log("room", room);
      if (!graph[room.room_id]) {
        addRoom(room, graph);
      }

      console.log("prev_room", prev_room);
      console.log("current_room", room);

      // save current_room to prev_room, direction
      console.log("prev", graph[prev_room.room_id]);
      graph[prev_room.room_id].neighbors[direction] = room;
      // save prev_room to current_room, opposite direction of move
      graph[room.room_id].neighbors[opposite_direction[direction]] = prev_room;
    } else {
      // else use bfs to find another valid room
      bfs(room, graph);
    }
    console.log("GRAPH", graph);
    console.log("GRAPH", JSON.stringify(graph));
  }

  // console.log graph data
  return <>Lets Map that Graph</>;
};

//Add Room Helper

// graph = [{"room_id": 0, "room_name": "name", neighbors: {"n": "?", "s": "?", "e": "?", "w": "?"}}}]
function addRoom(data, graph) {
  let neighbors = {};
  for (let i = 0; i < data.exits.length; i++) {
    //Response object contains, current room_id and exits which is array has exits
    neighbors[data.exits[i]] = "?";
  }

  graph[data.room_id] = { ...data, neighbors };
}

// //Random
function randomChoice(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

// // for ( let [key, value] of Object.entries(graph[data.room_id])){
// // }

function validDirection(data, graph) {
  let options = [];
  let neighbors = Object.entries(data.neighbors);
  for (let [direction, room] of neighbors) {
    if (graph[data.room_id].neighbors[direction] === "?") {
      options.push(direction);
      console.log("DIRECTION OPTIONS", options);
    }
  }
  if (options.length > 0) {
    console.log(randomChoice(options));
    return randomChoice(options);
  } else {
    return null;
  }
}

function bfs(startingRoom, graph) {
  const queue = [];
  queue.push([startingRoom]);
  const visited = Set();
  while (queue.length > 0) {
    let path = queue.pop();
    let room = path[path.length - 1];
    if (validDirection(room) !== null) {
      return path;
    }
    if (!visited.has(room.room_id)) {
      visited.add(room.id);
      let neighbors = graph[room.room_id].neighbors;
      for (let neighbor of neighbors) {
        let new_path = [...path, neighbor];
        queue.pop(new_path);
      }
    }
  }
}

function walkBack(path, graph) {}

function wait(seconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < seconds * 1000);
}
