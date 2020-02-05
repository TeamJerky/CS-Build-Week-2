import React from "react";
import { StateProvider } from "./contexts/StateContext";
import { rootReducer, initialState } from "./reducers";

import { makeGraph } from "./util/traverse";

function App() {
  makeGraph();

  return (
    <StateProvider initialState={initialState} reducer={rootReducer}>
      <div className="App">Treasure Hunt</div>
    </StateProvider>
  );
}

export default App;
