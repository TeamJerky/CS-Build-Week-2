import { axiosWithAuth } from "../util/axiosAuth";
import { sha256 } from "js-sha256";
import { compiledCPU } from "../util/compiledCPU";
import { initGame } from "../data";
import { wait } from "../util/traverse";
import { darkmap } from "../util/darkworldmap";
import { traverse } from "../util/shortestPath";

export const getLastProof = () => {
  return axiosWithAuth()
    .get("bc/last_proof/")
    .then(res => res.data)
    .catch(err => console.log(err.response));
};

export const findProofOfWork = (lastProof, difficulty) => {
  let proof = 0;
  let dif = "0".repeat(difficulty);
  while (sha256(`${lastProof}${proof}`).slice(0, difficulty) !== dif) {
    proof++;
  }
  return proof;
};

export const mine = async () => {
  console.log("getting last proof...");
  let lastProof = await getLastProof();
  //   console.log('last proof: ', lastProof);
  let { proof, difficulty, cooldown } = lastProof;
  //   wait(cooldown)
  //   console.log('proof: ', proof);
  console.log("finding proof of work...");
  let workingProof = findProofOfWork(proof, difficulty);
  console.log("proof of work found!");
  return axiosWithAuth()
    .post("bc/mine/", { proof: workingProof })
    .then(res => {
      console.log("proof of work submission result: ", res.data);
      return res.data;
    })
    .catch(err => console.log(err.response));
};

const examine = () => {
  return axiosWithAuth()
    .post("adv/examine/", { name: "Wishing Well" })
    .then(res => res.data)
    .catch(err => console.log(err.response));
};

const getSnitch = () => {
  return axiosWithAuth()
    .post("adv/take/", { name: "golden snitch" })
    .then(res => {
      if (
        res.data.messages[0] ===
        "A great warmth floods your body as your hand closes around the snitch before it vanishes."
      ) {
        console.log("Success!", res.data);
      } else {
        console.log("Failed :(", res.data);
      }
      return res.data;
    })
    .catch(err => console.log(err.response));
};

export const recall = () => {
  return axiosWithAuth()
    .post("adv/recall/")
    .then(res => res.data)
    .catch(err => console.log(err));
};
export const warp = () => {
  return axiosWithAuth()
    .post("adv/warp/")
    .then(res => res.data)
    .catch(err => console.log(err));
};
// Automated call
export const autoSnitchMiner = async () => {
  // let cpu = new compiledCPU();
  // First init to get starting room
  let init = await initGame();
  wait(init.cooldown);
  while (true) {
    let cpu = new compiledCPU();
    // Go to well (rm 555)
    // console.log(init, 'init');
    if (init.room_id !== 555) {
      let well = await traverse(555, darkmap);
      // console.log('WELL', well);
      wait(well.cooldown);
      // init = well;
    }
    // Examine (res.data.description === string to decode)
    let message = await examine();
    wait(message.cooldown);
    // console.log('message: ', message);
    // Decode to get room #
    cpu.load(message.description);
    let room_number = cpu.run();
    console.log("room number", room_number);
    // traverse to room
    let snitch_room = await traverse(+room_number, darkmap);
    wait(snitch_room.cooldown);
    // pick up snitch
    let snitch = await getSnitch();
    // console.log('SNITCH', snitch);
    wait(snitch.cooldown);
    // loop;
    let recallToZero = await recall();
    wait(recallToZero.cooldown);
    let warpToDarkWorld = await warp();
    wait(warpToDarkWorld.cooldown);
    init = warpToDarkWorld;
  }
};
