import { map } from "./map";
import { initGame } from "../data";
import { walkBack, moveBoost, wait } from "./traverse";

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

export async function traverse(target) {
  let room = await initGame();
  wait(room.cooldown);
  let path = goToRoomById(map[room.room_id], map, target);
  console.log("room", room, "path", path);
  await walkBack(path);
}

export default goToRoomById;
