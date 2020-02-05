import React from "react";
import { StateProvider } from "./contexts/StateContext";
import { rootReducer, initialState } from "./reducers";
import { traverse } from "./util/shortestPath";
import {mine} from "./actions/miningActions"

function App() {
  //374 warp
  //55 well
  //495 transmor
  //1 shop
  //
  traverse(374);
  // walkBack(path);
  // mine();

  return (
    <StateProvider initialState={initialState} reducer={rootReducer}>
      <div className="App">Treasure Hunt</div>
    </StateProvider>
  );
}

export default App;
