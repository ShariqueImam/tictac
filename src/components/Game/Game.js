/*
  This code defines a React component called "Game" that represents a Tic-Tac-Toe game.
  It imports various dependencies, including other components and utility functions.

  The gamestartStats constant represents the initial state of the game, including the board squares,
  local winners, active fields, player turns, winner status, and size.

  The Game component extends the React Component class and manages its state, which is initialized
  with the gamestartStats. The state also includes the players, which are either provided through props
  or set to the default humanVsHuman settings.

  The component utilizes a web worker API for running AI moves asynchronously. The workers array keeps track
  of active worker IDs, and the workerApi variable is used to communicate with the worker.

  The component defines various methods for getting AI moves, managing worker IDs, checking for update
  occurrences, removing workers, and initializing the web worker.

  Additional methods handle getting and setting player information, handling user clicks on the board,
  rendering the game board, and handling AI moves based on the current game state.

  The render method returns the JSX markup for the game, including the player settings, game board,
  game sidebar (if enabled), and other UI elements.

  The Grid component is a functional component that generates a grid for rendering the game board.

  Overall, this code provides the necessary logic and components for a Tic-Tac-Toe game with AI functionality
  and customizable player settings.
*/
import React, { Component } from "react";
import Board from "./Board.js";
import generateGridNxN from "../util/GameUtil.js";
import Field from "../util/Field.js";
import { humanVsHuman } from "../Settings/PlayerSettings.js";
import { wrap } from "comlink";
import GameSidebar from "./GameSideBar.js";
import PlayerSettings from "../Settings/PlayerSettings.js";

export const gamestartStats = {
  squares: Array(3 * 3).fill(
    // Outer squares
    Array(3 * 3).fill(null)
  ), // Inner squares
  localWinners: Array(3 * 3).fill(null),
  activeFields: Array(9).fill(true),
  xIsNext: true,
  winner: null,
  size: 3,
};

export default class Game extends Component {
  state = {
    ...gamestartStats,
  };

  constructor(props) {
    super(props);
    if (props.players) {
      this.state.players = props.players;
    } else {
      this.state.players = humanVsHuman;
    }
  }

  // Variables for web worker API
  workerApi = undefined;
  workers = [0];

  getAIMove = (t, type) => {
    this.removeWorkers();

    // Get an available worker
    this.getWorker();

    // Define a callback function for handling the AI move
    const doMove = (move, w) => {
      if (this.noUpdateOccured(w)) {
        if (move) {
          t.handleClick(move);
        } else {
          throw Error("move is undefined: " + move);
        }
      }
    };

    let id = this.getIdWorkerId();
    if (type === "rAI") {
      // Call the web worker API for getting a random move
      this.workerApi.getRandomMove(t.state).then((move) => {
        doMove(move, id);
      });
    } else if (type === "AI") {
      // Get the AI move based on the current player's turn and time settings
      let time = t.state.xIsNext
        ? this.state.players.aiP1T
        : this.state.players.aiP2T;
      time = time * 1000;
      this.workerApi.getMonteCarloMove(t.state, time).then((move) => {
        doMove(move, id);
      });
    }
  };

  // Generate a unique ID for the worker
  getIdWorkerId = () => {
    let id = this.workers[0] + 1;
    this.workers.push(id);
    this.workers[0] = id + 1;
    return id;
  };

  // Check if an update occurred for a given worker ID
  noUpdateOccured = (id) => {
    return this.workers.indexOf(id) !== -1;
  };

  // Remove all workers except the first one
  removeWorkers = () => {
    this.workers = [this.workers[0]];
  };

  // Initialize the web worker if not already done
  getWorker = () => {
    if (!this.workerApi) {
      const worker = new Worker("../webworker", {
        name: "webworker",
        type: "module",
      });
      this.workerApi = wrap(worker);
    }
  };

  // Get the player settings
  getPlayer = () => {
    return this.players;
  };

  // Set the player settings
  setPlayer = (players) => {
    this.setState({ players: { ...players } });
    if (this.props.onPlayerChange) {
      this.props.onPlayerChange(players);
    }
  };

  // Handle user click on the board
  handleClick = (move) => {
    if (this.state.winner) {
      return;
    }
    const nextData = Field.getNextData(this.state, move);

    this.setState((prevState, props) => ({
      ...nextData,
    }));
  };

  // Render a board component for the given index
  renderBoard = (i) => {
    return (
      <Board
        key={i}
        size={3}
        squares={this.state.squares[i]}
        winner={this.state.localWinners[i]}
        clickable={this.state.activeFields[i]}
        onClick={(p) => this.handleClick(Field.getMove(p, i))}
      />
    );
  };

  // Render the game component
  render() {
    this.handleAI();
    const { state } = this;
    return (
      <div className="">
        <div className="Game-Settings">
          <PlayerSettings
            callBackPlayer={this.setPlayer}
            players={state.players}
          />
        </div>
        <div className="game-container margin">
          <div className="game-row">
            <Grid render={this.renderBoard} />
          </div>
        </div>
        <br />
        <div className="game-container">
          {this.props.renderInfo && (
            <GameSidebar
              clock={this.props.clock}
              timeOver={this.timeOver}
              time={this.props.time}
              state={state}
            />
          )}
        </div>
      </div>
    );
  }

  // Handle AI moves
  handleAI = () => {
    const { state } = this;
    if (Field.getMoves(state).length > 0) {
      if (state.xIsNext && state.players.p1 !== "human") {
        this.getAIMove(this, state.players.p1);
      } else if (!state.xIsNext && state.players.p2 !== "human") {
        this.getAIMove(this, state.players.p2);
      }
    }
  };

  // Handle time over event
  timeOver = (player) => {
    if (player === "X") {
      this.setState({ winner: "O" });
    } else {
      this.setState({ winner: "X" });
    }
  };
}

// Generate a grid for rendering the game board
function Grid(props) {
  return generateGridNxN("game", 3, props.render);
}
