import { axiosWithAuth } from "../util/axiosAuth";
import { initGame } from "../data";
import { walkBack, wait, moveBoosted } from "./traverse";
import { goToRoomById, traverse } from "./shortestPath";
import { recall, warp } from "../actions/miningActions";

export const fly = (dir, nextRoom) => {
  let direction = { direction: dir, next_room_id: nextRoom };
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

export async function sellTreasure(room, inventory) {
  if (room.room_id !== 0 && room.room_id !== 1) {
    let roomZero = await recall();
    wait(roomZero.cooldown);
  }

  // Random bfs is happening?

  if (room.room_id !== 1) {
    let shop = await moveBoosted("w", "1");
    wait(shop.cooldown);
    console.log("Going to shop", shop, shop.cooldown);
  }

  console.log("Inventory", inventory);
  for (let i = 0; i < inventory.length; i++) {
    try {
      let sold = await sellItem(inventory[i]);
      console.log(inventory, inventory[i]);
      wait(sold.cooldown);
    } catch (err) {
      alert(err);
    }
  }
}

export const collectTreasure = async map => {
  //Initialize current player location
  let room = await initGame();

  while (true) {
    wait(room.cooldown);
    room = await traverseForGold(Math.floor(Math.random() * 499), map);
  }
};

export async function traverseForGold(target, map) {
  let room = await initGame();
  wait(room.cooldown);
  let path = goToRoomById(map[room.room_id], map, target);
  // console.log("room", room, "path", path);

  return await walkBackForGold(path);
}

export async function walkBackForGold(path) {
  let startingRoom = path.shift();
  let nextRoom = null;
  let player = await playerStatus();
  wait(player.cooldown);
  let newRoom = await initGame();
  wait(newRoom.cooldown);

  // console.log("walkBack path", path, "startingRoom", startingRoom);

  while (path.length > 0 && player.encumbrance < player.strength) {
    nextRoom = path.shift();
    let directions = ["n", "s", "e", "w"];

    for (let dir of directions) {
      if (startingRoom.neighbors[dir] === nextRoom.room_id) {
        console.log("NEXT ROOM ID", nextRoom.room_id);
        if (nextRoom.terrain !== "CAVE") {
          newRoom = await fly(dir, `${nextRoom.room_id}`);
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
          player = await playerStatus();
          wait(player.cooldown);
        }
        break;
      }
    }
  }
  if (player.encumbrance >= player.strength) {
    console.log("Selling due to encumbrance");
    await sellTreasure(newRoom, player.inventory);
  }
  return startingRoom;
}
