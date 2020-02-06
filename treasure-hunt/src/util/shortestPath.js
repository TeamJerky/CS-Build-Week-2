import { map } from "./map";
import { initGame } from "../data";
import { walkBack, wait } from "./traverse";

function goToRoomById(startingRoom, graph, roomId) {
  console.log("STARTING ROOM BFS", startingRoom);
  let queue = [];
  queue.push([startingRoom]);
  const visited = new Set();
  while (queue.length > 0) {
    let path = queue.shift();
    let room = path[path.length - 1];
    //Condition to return path when given room id is found aka shop, return that path, otherwise keep searching for it
    if (room.room_id === roomId) {
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

export async function traverse(target, map) {
  let room = await initGame();
  wait(room.cooldown);
  let path = goToRoomById(map[room.room_id], map, target);
  console.log("room", room, "path", path);
  return await walkBack(path);
}

// if the direction is the same, you can dash quickly
// '{"direction":"n", "num_rooms":"5", "next_room_ids":"10,19,20,63,72"}'
function dash(start, path, map) {
  // grab existing path
  // for room in path
  // if the direction is the same, dash
  let newPath = [...path];
  let startingRoom = map[start.room_id];
  for (let room in path) {
  }
}

export default goToRoomById;
