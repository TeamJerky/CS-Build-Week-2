import React, { useState } from "react";
import { StateProvider } from "./contexts/StateContext";
import { rootReducer, initialState } from "./reducers";
import { traverse } from "./util/shortestPath";
import { map } from "./util/map";
import { darkmap } from "./util/darkworldmap";
import { mine, autoSnitchMiner } from "./actions/miningActions";

import { axiosWithAuth } from "./util/axiosAuth";

function App() {
  // traverse(0);
  // traverseDarkWorld(555);
  // mine();
  const [darkRoom, setDarkRoom] = useState(null);

  const examine = () => {
    return axiosWithAuth()
      .post("adv/examine/", { name: "Wishing Well" })
      .then(res => console.log(res.data))
      .catch(err => console.log(err.response));
  };

  const updateDarkRoom = event => {
    setDarkRoom(event.target.value);
  };

  const darkWorld = event => {
    event.preventDefault();
    traverse(+darkRoom, darkmap);
  };

  const goToWell = () => {
    traverse(555, darkmap);
  };

  const getSnitch = () => {
    return axiosWithAuth()
      .post("adv/take/", { name: "golden snitch" })
      .then(res => console.log(res.data))
      .catch(err => console.log(err.response));
  };

  autoSnitchMiner();

  return (
    <StateProvider initialState={initialState} reducer={rootReducer}>
      <div className="App">Treasure Hunt</div>
      <form onSubmit={darkWorld}>
        <label htmlFor="dark">
          Dark Room Travel:
          <input
            type="number"
            name="dark"
            id="dark"
            onChange={updateDarkRoom}
          />
        </label>
        <button>Travel</button>
      </form>
      <button onClick={goToWell}>Go To Well</button>
      <button onClick={examine}>Examine</button>
      <button onClick={getSnitch}>Take 'golden snitch'</button>
    </StateProvider>
  );
}

export default App;
