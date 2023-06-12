import { getRandomMove } from "../AI/AI"; // Importing getRandomMove function from "../AI" module
import { squareColors } from "../Game/Square"; // Importing squareColors variable from "../Square" module

export default class Field {
  static getMoves(data) {
    let moves = [];
    data.localWinners.forEach((field, outer_idx) => { // Iterate over localWinners array
      if (field === null && data.activeFields[outer_idx]) { // Check if field is null and the corresponding outer field is active
        data.squares[outer_idx].forEach((x, inner_idx) => { // Iterate over the inner field of the current outer field
          if (x === null) { // Check if the inner field is empty
            moves.push(Field.getMove(inner_idx, outer_idx)); // Add the move to the moves array
          }
        });
      }
    });
    return moves; // Return the moves array
  }

  static getNextData(data, move) {
    if (data.xIsNext === undefined) {
      throw Error("Data xIsNext is undefined");
    }

    let squares = data.squares.map((x) => x.slice()); // Create a copy of the squares array

    if (!move || squares[move.outer_idx][move.inner_idx]) { // Check if move is null or if the field is already taken
      console.log("hello");
      throw Error("field already taken");
    }
    if (!data.activeFields[move.outer_idx]) { // Check if the outer field is inactive
      throw Error("field inactive");
    }

    squares[move.outer_idx][move.inner_idx] = data.xIsNext ? "X" : "O"; // Set the selected field with "X" or "O" based on the value of xIsNext
    const localWinners = squares.map((x) => Field.calc3x3(x)); // Calculate local winners for each outer field
    const winner = Field.calc3x3(localWinners); // Calculate the overall winner
    let activeFields = data.activeFields.slice(); // Create a copy of the activeFields array
    if (localWinners[move.inner_idx]) { // Check if the inner field has a local winner
      localWinners.forEach((x, i) => (activeFields[i] = x ? false : true)); // Update the activeFields array based on the local winners
    } else {
      activeFields = activeFields.map((x, i) => i === move.inner_idx); // Set the active field based on the selected inner field
    }

    if (winner) {
      activeFields = Array(9).fill(false); // If there is an overall winner, set all outer fields as inactive
    }

    return {
      winner: winner,
      squares: squares,
      localWinners: localWinners,
      activeFields: activeFields,
      xIsNext: !data.xIsNext,
    }; // Return the updated data object
  }

  static getMove = (i, o) => {
    return { inner_idx: i, outer_idx: o }; // Return an object representing a move with inner and outer indices
  };

  static calc3x3 = (field) => {
    field = field.map((x) => (x ? x : " ")); // Replace null values with empty strings in the field array
    var matches = ["XXX", "OOO"]; // Define the winning combinations

    var winCombinations = [
      field[0] + field[1] + field[2], // 1st line
      field[3] + field[4] + field[5], // 2nd line
      field[6] + field[7] + field[8], // 3rd line
      field[0] + field[3] + field[6], // 1st column
      field[1] + field[4] + field[7], // 2nd column
      field[2] + field[5] + field[8], // 3rd column
      field[0] + field[4] + field[8], // Primary diagonal
      field[2] + field[4] + field[6], // Secondary diagonal
    ];

    // Loop through all the rows looking for a match
    for (var i = 0; i < winCombinations.length; i++) {
      if (
        winCombinations[i] === matches[0] ||
        winCombinations[i] === matches[1]
      ) {
        return winCombinations[i].charAt(0); // Return the winner character if a match is found
      }
    }
    return null; // Return null if there is no winner
  };

  static calcWinner = (squares) => {
    return Field.calc3x3(squares.map((x) => Field.calc3x3(x))); // Calculate the overall winner based on the squares array
  };

  static dataIsOver(data) {
    return Field.getMoves(data).length === 0; // Check if there are no available moves in the data object
  }

  static propagate(tree) {
    let data = tree.data;
    if (tree.hasChildren()) {
      throw Error("Tree shouldn't have children");
    } else {
      let winner = Field.calc3x3(data.localWinners); // Calculate the overall winner from local winners
      while (!Field.dataIsOver(data)) {
        data = Field.getNextData(data, getRandomMove(data)); // Get the next data object by making a random move
        winner = data.winner; // Update the winner
      }
      if (winner) {
        return winner === (tree.data.xIsNext ? "O" : "X") // Check if the winner matches the player's mark
          ? Results.VICTORY
          : Results.DEFEAT;
      } else {
        return Results.DRAW;
      }
    }
  }
}

export const Results = {
  VICTORY: 1,
  DEFEAT: -1,
  DRAW: 0,
};
