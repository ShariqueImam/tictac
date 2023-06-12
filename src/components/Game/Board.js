import React from "react";
import Square from "./Square.js";
import generateGridNxN from "../util/GameUtil.js";

// Component representing the game board
export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.renderSquare = this.renderSquare.bind(this);
  }

  // Function to render a square on the board
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        winner={this.props.winner}
        clickable={!this.props.squares[i] && this.props.clickable}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  // Render the game board
  render() {
    // Generate a grid of squares using the provided utility function
    return generateGridNxN("board", this.props.size, this.renderSquare);
  }
}
