import React from "react";
import { StateProvider } from "./contexts/StateContext";
import { rootReducer, initialState } from "./reducers";
import { traverse } from "./util/shortestPath";

function App() {
  traverse(329);
  // walkBack(path);
  return (
    <StateProvider initialState={initialState} reducer={rootReducer}>
      <div className="App">Treasure Hunt</div>
    </StateProvider>
  );
}

export default App;
