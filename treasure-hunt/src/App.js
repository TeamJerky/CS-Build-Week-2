import React from "react";
import { StateProvider } from "./contexts/StateContext";
import { rootReducer, initialState } from "./reducers";
import { traverse } from "./util/shortestPath";

function App() {
  traverse(356);

  return (
    <StateProvider initialState={initialState} reducer={rootReducer}>
      <div className="App">Treasure Hunt</div>
    </StateProvider>
  );
}

export default App;
