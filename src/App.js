import React from "react";
import SettingsForm from "./components/Settings/SettingsForm.js";
import Game from "./components/Game/Game.js";
import { defaultPlayers } from "./components/Settings/PlayerSettings.js";
import PlayerName from "./components/Settings/PlayerName";
import axios from "axios";
// Default settings for the app
export const defaultSettings = {
  clock: false,
  time: 1,
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    // Initial state of the app
    this.state = {
      clock: defaultSettings.clock,
      time: defaultSettings.time,
      matchID: 0,
    };
    // Binding the newGame function to the component instance
    this.newGame = this.newGame.bind(this);
  }

  // Default players for the game
  players = defaultPlayers;

  // Function to start a new game with the specified clock and time settings
  newGame(clock, time) {
    this.setState((prevState, props) => ({
      clock: clock,
      time: time,
      matchID: prevState.matchID + 1,
    }));
  }

  // Callback function for player change in the settings form
  onPlayerChange = (player) => {
    this.players = player;
  };

  updatePlayer(players) {
    // Function to update the player settings (not implemented)
  }
  render() {
    sessionStorage.setItem("control", 1);

    return (
      <div className="background">
        <div className="animation">
          <h3 className="gameName">Ultimate Tic Tac Toe</h3>
          <div className="row justify-content-center">
            <PlayerName />
            <br />
          </div>
          <div className="row justify-content-center">
            {/* Settings form component */}
            <SettingsForm
              defaultValues={this.state}
              submitCallback={this.newGame}
            />
            <br />
          </div>
          <div className="row justify-content-center">
            {/* Game component */}
            <Game
              key={this.state.matchID}
              clock={this.state.clock}
              time={this.state.time}
              players={this.players}
              onPlayerChange={this.onPlayerChange}
              renderInfo={true}
            />
          </div>
        </div>
      </div>
    );
  }
}
