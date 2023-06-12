import React from "react";

// Define colors for different square states
export const colorForTheBoxesOfGame = {
  X: "blue",
  O: "green",
  WINNER_X: "#c8d2f6",
  WINNER_O: "#c3f4c8",
  DRAW: "#F0F8FF",
  CLICKABLE: "#dce69f",
};

// Square component
export default function Square(props) {
  var style = { display: "inline-block" };

  // Set color based on the value of the square (X or O)
  if (props.value) {
    style.color =
      props.value === "X" ? colorForTheBoxesOfGame.X : colorForTheBoxesOfGame.O;
  }

  // Set background color based on the winner of the game
  if (props.winner) {
    if (props.winner === "X") {
      style.background = colorForTheBoxesOfGame.WINNER_X;
    } else if (props.winner === "O") {
      style.background = colorForTheBoxesOfGame.WINNER_O;
    } else {
      style.background = colorForTheBoxesOfGame.DRAW;
    }
  }

  // Set background color for clickable squares
  if (props.clickable) {
    style.background = colorForTheBoxesOfGame.CLICKABLE;
  }
  if (!props.clickable) {
    let a = +sessionStorage.getItem("a");
    sessionStorage.setItem("a", a + 1);
    if (sessionStorage.getItem("a") != 81) {
      sessionStorage.setItem("bb", 0);
    }
    if (sessionStorage.getItem("a") == 81) {
      sessionStorage.setItem("bb", 1);
    }
  }

  return (
    <button
      className="square"
      style={style}
      onClick={() => {
        if (props.clickable) {
          props.onClick();
        }
      }}
    >
      {props.value}
    </button>
  );
}

// Initialize unique ID counter
let lastId = 0;

// Generate a unique ID with an optional prefix
const uniqueid = (prefix = "id") => {
  return `${lastId++}`;
};
