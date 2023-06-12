import React, { Component, useEffect } from "react";

// Access the localStorage object from the browser's window object
const { localStorage } = window;

// Set initial values in the localStorage
localStorage.setItem("player1Select", "human1");
localStorage.setItem("player2Select", "human2");

// Define default players configuration
export const defaultPlayers = {
  p1: "human",
  p2: "human",
  aiP1T: 1,
  aiP2T: 1,
};

// Define human vs human players configuration
export const humanVsHuman = {
  p1: "human",
  p2: "human",
  aiP1T: 1,
  aiP2T: 1,
};

// Define dropdown options for player selection
export const dropdownOptions = [
  { key: "h", value: "human", text: "human" },
  { key: "rAI", value: "rAI", text: "random AI" },
  { key: "a", value: "AI", text: "AI" },
];

// Define the PlayerSettings component
class PlayerSettings extends Component {
  state = {
    players: this.props.players, // Current players configuration
    callBackPlayer: this.props.callBackPlayer, // Callback function for player updates
  };

  // Handle changes in player selection
  handlePlayers = (event) => {
    const target = event.target;
    this.handlePlayerTarget(target);
  };

  // Handle changes in individual player selection
  handlePlayerTarget = (name, target) => {
    if (name === "p1") {
      if (target.value === "human") {
        localStorage.setItem("player1Select", "human1");
      }
      if (target.value === "rAI") {
        localStorage.setItem("player1Select", "rAI1");
      }
      if (target.value === "AI") {
        localStorage.setItem("player1Select", "AI1");
      }
    }
    if (name === "p2") {
      if (target.value === "human") {
        localStorage.setItem("player2Select", "human2");
      }
      if (target.value === "rAI") {
        console.log("af");
        localStorage.setItem("player2Select", "rAI2");
      }
      if (target.value === "AI") {
        localStorage.setItem("player2Select", "AI2");
      }
    }

    // Update the selected value for the player
    const value = target.type === "checkbox" ? target.checked : target.value;
    let copy = { ...this.state.players };
    copy[name] = value;
    this.setState({ players: copy });

    // Call the callback function with the updated player configuration
    if (this.state.callBackPlayer) {
      this.state.callBackPlayer(copy);
    }
  };

  render() {
    if (sessionStorage.getItem("control") == 1) {
      let randomValue = Math.round(Math.random());
      sessionStorage.setItem("random", randomValue);
      let arr = [
        sessionStorage.getItem("player1"),
        sessionStorage.getItem("player2"),
      ];
      if (randomValue == 1) {
        sessionStorage.setItem("player1", arr[0]);
        sessionStorage.setItem("player2", arr[1]);
      } else {
        sessionStorage.setItem("player1", arr[1]);
        sessionStorage.setItem("player2", arr[0]);
      }
    }
    sessionStorage.setItem("control", 0);
    let p1, p2;
    if (
      sessionStorage.getItem("player1") == "null" &&
      sessionStorage.getItem("player2") == "null"
    ) {
      p1 = "Player 1";
      p2 = "Player 2";
    } else {
      p1 = sessionStorage.getItem("player1");
      p2 = sessionStorage.getItem("player2");
    }
    return (
      <div>
        <section className="playerOptionContainer">
          <h4 className="playerOptionHeading">{p1}</h4>
          <p
            onClick={() => this.handlePlayerTarget("p1", { value: "human" })}
            className={`${
              localStorage.getItem("player1Select") === "human1" &&
              "playerOptionSelected"
            } playerOption`}
          >
            Human
          </p>
          <p
            onClick={() => this.handlePlayerTarget("p1", { value: "rAI" })}
            className={`${
              localStorage.getItem("player1Select") === "rAI1" &&
              "playerOptionSelected"
            } playerOption`}
          >
            Random AI
          </p>
          <p
            onClick={() => this.handlePlayerTarget("p1", { value: "AI" })}
            className={`${
              localStorage.getItem("player1Select") === "AI1" &&
              "playerOptionSelected"
            } playerOption`}
          >
            AI
          </p>
        </section>
        <section className="playerOptionContainer">
          <h4 className="playerOptionHeading"> {p2}</h4>
          <p
            onClick={() => this.handlePlayerTarget("p2", { value: "human" })}
            className={`${
              localStorage.getItem("player2Select") === "human2" &&
              "playerOptionSelected"
            } playerOption`}
          >
            Human
          </p>
          <p
            onClick={() => this.handlePlayerTarget("p2", { value: "rAI" })}
            className={`${
              localStorage.getItem("player2Select") === "rAI2" &&
              "playerOptionSelected"
            } playerOption`}
          >
            Random AI
          </p>
          <p
            onClick={() => this.handlePlayerTarget("p2", { value: "AI" })}
            className={`${
              localStorage.getItem("player2Select") === "AI2" &&
              "playerOptionSelected"
            } playerOption`}
          >
            AI
          </p>
        </section>
      </div>
    );
  }
}

export default PlayerSettings;
