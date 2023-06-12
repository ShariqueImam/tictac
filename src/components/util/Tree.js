import Field, { Results } from "./Field";

// Class representing a tree node
export default class Tree {
  nodes = [];
  data = {};
  parent = undefined;
  move = undefined;
  score = 0;
  simulationCount = 0;
  initTime = undefined;

  constructor(data, parent, move, time) {
    if (
      !("xIsNext" in data) ||
      !("squares" in data) ||
      !("localWinners" in data)
    ) {
      throw Error("Tree data incomplete +" + data);
    }

    this.data = { ...data };
    this.parent = parent;
    this.move = move;
    this.initTime = time;
  }

  // Check if the node has children
  hasChildren = () => {
    return this.nodes.length > 0;
  };

  // Get the best child node based on scores
  getBestNode = () => {
    this.sortTime = Date.now();
    return this.nodes.sort(this.compareNodes)[this.nodes.length - 1];
  };

  // Compare two nodes based on their scores
  compareNodes = (n1, n2) => {
    return n1.getScore(this.sortTime) - n2.getScore(this.sortTime);
  };

  // Get the score of the node
  getScore = (time) => {
    if (this.simulationCount === 0) {
      return 0.5 * Math.log10(Math.sqrt(time + 1 - this.initTime));
    } else {
      return (
        this.score / this.simulationCount +
        0.5 *
          Math.log10(Math.sqrt(time + 1 - this.initTime) / this.simulationCount)
      );
    }
  };

  // Create child nodes for the current node
  makeChildren = () => {
    if (this.hasChildren()) {
      throw Error("makeChildren even due has children");
    }

    let moves = Field.getMoves(this.data);
    let time = Date.now();

    // Create a new tree node for each possible move
    moves.forEach((move) => {
      let data = Field.getNextData(this.data, move);
      this.nodes.push(new Tree(data, this, move, time));
    });
  };

  // Get a random child node
  getRandomChild = () => {
    return random_item(this.nodes);
  };

  // Update the node with the result of a simulation
  update = (result) => {
    this.simulationCount++;
    if (result === Results.VICTORY) {
      this.score++;
      if (this.parent) {
        this.parent.update(Results.DEFEAT);
      }
    } else if (result === Results.DEFEAT) {
      if (this.score > 0) {
        this.score--;
      }
      if (this.parent) {
        this.parent.update(Results.VICTORY);
      }
    } else {
      if (this.parent) {
        this.parent.update(Results.DRAW);
      }
    }
  };

  // Check if the game is over for the current node
  isOver = () => {
    return Field.getMoves(this.data).length === 0;
  };

  // Get the child node with the highest simulation count
  getMostUsed = () => {
    return this.nodes.sort(this.highestSimulationCount)[this.nodes.length - 1];
  };

  // Compare two nodes based on their simulation counts
  highestSimulationCount(node1, node2) {
    return node1.simulationCount - node2.simulationCount;
  }
}

// Function to get a random item from an array
function random_item(items) {
  return items[Math.floor(Math.random() * items.length)];
}
