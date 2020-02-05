import React from "react";
import { axiosWithAuth } from "./axiosAuth";
import { initGame } from "../data";
// import { move } from "../actions";

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
    .post("adv/move/", command)
    .then(res => {
      return res.data;
    })
    .catch(err => console.log("error", err.response));
};

export const moveBoosted = (direction, nextRoomId) => {
  let command = { direction: direction, next_room_id: `${nextRoomId}` };
  return axiosWithAuth()
    .post("adv/move/", command)
    .then(res => {
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
  console.log(room)

  while (Object.keys(graph).length < 500) {
    wait(room.cooldown);
    if (!graph[room.room_id]) {
      addRoom(room, graph);
    }

    console.log("CURRENT room", room);

    // find valid exits
    let direction = validDirection(graph[room.room_id], graph);
    // if there are options, traverse
    // create a post request to move
    prev_room = room;
    if (direction) {
      wait(room.cooldown);
      room = await move(direction);
      console.log(
        `Going from room ${prev_room.room_id} to room ${room.room_id}, going ${direction}`
      );

      if (!graph[room.room_id]) {
        addRoom(room, graph);
      }

      // save current_room to prev_room, direction
      graph[prev_room.room_id].neighbors[direction] = room.room_id;

      // save prev_room to current_room, opposite direction of move
      graph[room.room_id].neighbors[opposite_direction[direction]] =
        prev_room.room_id;
    } else {
      // else use bfs to find another valid room
      let bfsPath = bfs(graph[room.room_id], graph);
      console.log("BFSPATH", bfsPath);
      room = await walkBack(bfsPath);
    }
    if (Object.keys(graph).length % 10 === 0) {
      console.log("GRAPH", graph);
      console.log("JSON GRAPH", JSON.stringify(graph));
    }
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
    }
  }
  if (options.length > 0) {
    return randomChoice(options);
  } else {
    return null;
  }
}

function bfs(startingRoom, graph) {
  console.log("STARTING ROOM BFS", startingRoom);
  let queue = [];
  queue.push([startingRoom]);
  const visited = new Set();
  while (queue.length > 0) {
    let path = queue.shift();
    let room = path[path.length - 1];
    if (validDirection(room, graph) !== null) {
      return path;
    }
    if (!visited.has(room.room_id)) {
      visited.add(room.room_id);
      let neighbors = graph[room.room_id].neighbors;
      for (let neighbor in neighbors) {
        let new_path = [...path, graph[neighbors[neighbor]]];
        queue.push(new_path);
      }
    }
  }
}

async function walkBack(path) {
  let startingRoom = path.shift();
  let nextRoom = null;

  while (path.length > 0) {
    nextRoom = path.shift();
    let directions = ["n", "s", "e", "w"];
    for (let dir of directions) {
      if (startingRoom.neighbors[dir] === nextRoom.room_id) {
        console.log("NEXT ROOM ID", nextRoom.room_id);
        let newRoom = await moveBoosted(dir, nextRoom.room_id);
        startingRoom = nextRoom;
        console.log("COOLDOWN", newRoom.cooldown);
        wait(newRoom.cooldown);
        break;
      }
    }
  }
  return startingRoom;
}

function wait(seconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < seconds * 1000);
}
