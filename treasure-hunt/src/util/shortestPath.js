import { map } from "./map";
import { initGame } from "../data";
import { walkBack, wait } from "./traverse";

export function goToRoomById(startingRoom, graph, roomId) {
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

  // convert path to include possible dashes
  path = withDash(path, map);
  console.log("Dashed path", path);

  return await walkBack(path);
}

// if the direction is the same, you can dash quickly
// '{"direction":"n", "num_rooms":"5", "next_room_ids":"10,19,20,63,72"}'
// return [[{}, {}, {}], {}, [{}, {}]]

function withDash(path, map) {
  let finalPath = [];
  let startingRoom = path[0];

  let neighbors = Object.entries(map[startingRoom.room_id].neighbors); // [['n', 123], ...]

  let initialDirection = neighbors.filter(
    ([key, value]) => value === path[1].room_id
  )[0][0];

  let dashPath = [initialDirection];

  if (path.length <= 2) {
    dashPath.push(path[1]);
    finalPath.push(dashPath);
    console.log("dash path", dashPath, "final path", finalPath);
  } else {
    for (let i = 1; i < path.length - 1; i++) {
      let nextRoom = path[i];

      if (i + 1 < path.length - 1) {
        if (
          map[nextRoom.room_id].neighbors[initialDirection] !==
          path[i + 1].room_id
        ) {
          neighbors = Object.entries(map[nextRoom.room_id].neighbors);
          let currentDirection = neighbors.filter(
            ([key, value]) => value === path[i + 1].room_id
          )[0][0];
          if (initialDirection !== currentDirection) {
            initialDirection = currentDirection;
          }
          dashPath.push(nextRoom);
          finalPath.push(dashPath);
          dashPath = [initialDirection];
        } else {
          dashPath.push(nextRoom);
        }
      }

      if (i + 1 === path.length - 1) {
        if (
          map[nextRoom.room_id].neighbors[initialDirection] !==
          path[i + 1].room_id
        ) {
          neighbors = Object.entries(map[nextRoom.room_id].neighbors);
          let currentDirection = neighbors.filter(
            ([key, value]) => value === path[i + 1].room_id
          )[0][0];
          if (initialDirection !== currentDirection) {
            initialDirection = currentDirection;
          }
          dashPath.push(nextRoom);
          finalPath.push(dashPath);
          dashPath = [initialDirection];
          dashPath.push(nextRoom);
          dashPath.push(path[i + 1]);
          finalPath.push(dashPath);
        } else {
          dashPath.push(nextRoom, path[i + 1]);
          finalPath.push(dashPath);
        }
      }
    }
  }
  return finalPath;
}

export default goToRoomById;
