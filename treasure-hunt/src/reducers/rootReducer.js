import { gameReducer } from "./index";

export const rootReducer = ({ gameState }, action) => ({
  gameState: gameReducer(gameState, action)
});
