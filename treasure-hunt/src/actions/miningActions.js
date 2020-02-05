import { axiosWithAuth } from './util/axiosAuth';
import { sha256 } from 'js-sha256';

export const getLastProof = () => {
  return axiosWithAuth()
    .get('bc/last_proof/')
    .then(res => res.data)
    .catch(err => console.log(err.response));
};

export const findProofOfWork = (lastProof, difficulty) => {
  let proof = 0;
  let dif = '0'.repeat(difficulty);
  while (sha256(`${lastProof}${proof}`).slice(0, difficulty) !== dif) {
    proof++;
  }
  return proof;
};

export const mine = async () => {
  console.log('getting last proof...');
  let lastProof = await getLastProof();
  //   console.log('last proof: ', lastProof);
  let { proof, difficulty, cooldown } = lastProof;
  //   wait(cooldown)
  //   console.log('proof: ', proof);
  console.log('finding proof of work...');
  let workingProof = findProofOfWork(proof, difficulty);
  console.log('proof of work found!');
  return axiosWithAuth()
    .post('bc/mine/', { proof: workingProof })
    .then(res => {
      console.log('proof of work submission result: ', res.data);
      return res.data;
    })
    .catch(err => console.log(err.response));
};
