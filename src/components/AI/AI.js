import Field from "../util/Field";
import Tree from "../util/Tree";

// Function to get a random move from the available moves
export function getRandomMove(data) {
  const moves = Field.getMoves(data);
  return random_item(moves);
}

// Function to select a random item from an array
function random_item(items) {
  return items[Math.floor(Math.random() * items.length)];
}

// Function to get the best move using the Monte Carlo algorithm
export function getMonteCarloMove(data, time) {
  const tree = new Tree(data, null, null, Date.now());
  evaluateMoves(tree, time);
  return tree.getMostUsed().move;
}

// Function to evaluate moves using Monte Carlo simulation
function evaluateMoves(tree, time) {
  const startTime = Date.now();
  let x = 0;
  while (Date.now() - startTime < time) {
    evaluate(tree);
    x++;
  }
  console.log("Simulations: " + x);
}

// Function to evaluate a tree node
export function evaluate(tree) {
  while (tree.hasChildren()) {
    tree = tree.getBestNode();
  }
  if (!tree.isOver()) {
    tree.makeChildren();
    tree = tree.getRandomChild();
  }
  let result = Field.propagate(tree);
  tree.update(result);
}
