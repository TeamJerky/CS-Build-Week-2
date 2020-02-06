import { axiosWithAuth } from "../util/axiosAuth";
import { initGame } from "../data";
import { walkBack, wait, moveBoosted } from "./traverse";
import { goToRoomById, traverse } from "./shortestPath";
import { recall, warp } from "../actions/miningActions";

export const fly = dir => {
  let direction = { direction: dir };
  return axiosWithAuth()
    .post("adv/fly/", direction)
    .then(res => {
      return res.data;
    })
    .catch(err => console.log("error", err.response));
};

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

export const sellItem = item => {
  let toSell = { name: item, confirm: "yes" };
  return axiosWithAuth()
    .post("adv/sell/", toSell)
    .then(res => {
      console.log(`sold ${item}`);
      return res.data;
    })
    .catch(err => console.log("error", err.response));
};

export async function sellTreasure() {
  let roomZero = await recall();
  wait(roomZero.cooldown);
  let shop = moveBoosted("w", 1);
  wait(shop.cooldown);

  let player = await playerStatus();
  wait(player.cooldown);
  player.inventory(async item => {
    let sold = await sellItem(item);
    wait(sold.cooldown);
  });
}

export const collectTreasure = async map => {
  //Initialize current player location
  let room = await initGame();
  let prevRoom = room;

  while (true) {
    console.log("ROOM", room, "PREV ROOM", prevRoom);
    wait(room.cooldown);
    let player = await playerStatus();
    console.log("PLAYER", player);
    wait(player.cooldown);
    //Check for encumbrance
    if (player.encumbrance < player.strength) {
      room = await traverseForGold(Math.floor(Math.random() * 499), map);
      wait(room.cooldown);
    } else {
      sellTreasure();
    }
  }
};

export async function traverseForGold(target, map) {
  let room = await initGame();
  wait(room.cooldown);
  let path = goToRoomById(map[room.room_id], map, target);
  console.log("room", room, "path", path);

  return await walkBackForGold(path);
}

export async function walkBackForGold(path) {
  let startingRoom = path.shift();
  let nextRoom = null;

  console.log("walkBack path", path, "startingRoom", startingRoom);

  while (path.length > 0) {
    nextRoom = path.shift();
    let directions = ["n", "s", "e", "w"];
    let newRoom;

    for (let dir of directions) {
      if (startingRoom.neighbors[dir] === nextRoom.room_id) {
        console.log("NEXT ROOM ID", nextRoom.room_id);
        if (nextRoom.terrain === "MOUNTAIN") {
          newRoom = await fly(dir);
          console.log("FLYING", newRoom);
        } else {
          newRoom = await moveBoosted(dir, nextRoom.room_id);
          console.log("BOOSTED", newRoom);
        }
        startingRoom = nextRoom;
        console.log("COOLDOWN", newRoom.cooldown);
        wait(newRoom.cooldown);

        while (newRoom.items.length > 0) {
          let collected = await collectItem(newRoom.items[0]);
          console.log("COLLECTING ITEMS!", "Items", newRoom.items);
          newRoom = collected;
          wait(collected.cooldown);
        }
        break;
      }
    }
  }
  return startingRoom;
}
