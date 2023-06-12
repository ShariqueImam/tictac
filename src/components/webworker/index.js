import { expose } from "comlink";
import { getRandomMove, getMonteCarloMove } from "../AI/AI";

// Define the exported functions from this module
export const exports = {
  getRandomMove,
  getMonteCarloMove,
};

// Expose the defined exports to make them accessible from the main thread
expose(exports);
