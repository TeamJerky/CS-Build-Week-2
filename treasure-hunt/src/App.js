import React from "react";

import { makeGraph } from "./util/traverse";

function App() {
  makeGraph();

  // const handleTake = event => {
  //   event.preventDefault();
  //   handleTake(dispatch, name)
  // }

  return <div className="App">
    <button >take</button>
  </div>;
}

export default App;
