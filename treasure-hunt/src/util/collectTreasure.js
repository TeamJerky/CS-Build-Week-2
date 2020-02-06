import { map } from "./map";
import { initGame } from "../data";
import { walkBack, wait } from "./traverse";

export const playerStatus = () => {
  return axiosWithAuth()
    .post("adv/status/")
    .then(res => {
      return res.data;
    })
    .catch(err => console.log("error", err.response));
};

export const collectItem = item => {
  let command = { name: item };
  return axiosWithAuth()
    .post("adv/take/", command)
    .then(res => {
      return res.data;
    })
    .catch(err => console.log("error", err.response));
};

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

export async function traverseWithGold(target) {
  let room = await initGame();
  wait(room.cooldown);
  let path = goToRoomById(map[room.room_id], map, target);
  console.log("room", room, "path", path);
  await walkBack(path);
}

const collectTreasure = async () => {
  //Enter Graph data
  const graph = {};

  //Initialize current player location
  let room = await initGame();
  let player = await playerStatus();

  while (player.gold < 1000) {
    //Check for encumbrance
    if (player.encumbrance < player.strength) {
      //Scan the room for treasure
      while (room.items.length !== 0) {
        //Collect Treasure
        //Save the response may be or is it needed
        await collectItem(room.items[0]);
        //sync room locally and then rerun loop
        room = await initGame();
      }
      //Move to another room look for treasure
      let direction = randomDoorChoice(room, graph);
      room = await move(direction);
    } else {
      //Go to Shop
      let pathToShop = goToRoomById(room, graph, 1);
      room = await walkbback(pathToShop);
      //we are at the shop, lets sell stuff
      //request upto date status, loop through
      player = await playerStatus();

      while (player.inventory.length !== 0) {
        //Sell item at a time
        sellItem(player.inventory[0]);
        //Update player variable and this should also outermost loop count too
        player = await playerStatus();
      }
      //Once sold, repeat collecting treasure
    }
    //update
  }
};
