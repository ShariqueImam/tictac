import React from "react";
import CountDown from "./CountDown.js";
import Field from "../util/Field.js";

export default function GameSidebar(props) {
  return (
    <div className="game-info">
      {/* Render the game status */}
      <div id="status" className="gameInfo">
        {setStatus(props.state)}
      </div>

      {/* Render the countdown timers */}
      {props.clock && getTimeClock(props.timeOver, props.time, props.state)}
    </div>
  );
}

function getTimeClock(timeOverCallback, time, state) {
  // Determine if the X player's timer is paused
  const timerXPaused = !state.xIsNext || Boolean(state.winner);

  // Determine if the O player's timer is paused
  const timerOPaused = state.xIsNext || Boolean(state.winner);

  return (
    <div className="countDownBg">
      {/* Render the X player's countdown timer */}
      [TIME] X:{" "}
      <CountDown
        key={1}
        player="X"
        seconds={time * 60}
        isPaused={timerXPaused}
        timeOverCallback={timeOverCallback}
      />
      {/* Render the O player's countdown timer */}, O:{" "}
      <CountDown
        key={2}
        player="O"
        seconds={time * 60}
        isPaused={timerOPaused}
        timeOverCallback={timeOverCallback}
      />
    </div>
  );
}

function setStatus(state) {
  sessionStorage.setItem("a", 0);
  console.log(sessionStorage.getItem("bb"));
  let status;
  let xCount = 0;
  let oCount = 0;
  state.localWinners.forEach((element) => {
    if (element === "X") {
      xCount++;
    } else if (element === "O") {
      oCount++;
    }
  });
  if (state.winner) {
    if (state.winner == "X") {
      status = sessionStorage.getItem("player1") + " wins!";
    }
    if (state.winner == "O") {
      status = sessionStorage.getItem("player2") + " wins!";
    }
    // Check if the game ended due to time over
    if (Field.calc3x3(state.localWinners) === null) {
      status = "Time end!" + status;
    }
  } else {
    if (xCount > oCount && sessionStorage.getItem("bb") == 1) {
      status = sessionStorage.getItem("player1") + " wins!";
    } else if (xCount < oCount && sessionStorage.getItem("bb") == 1) {
      status = sessionStorage.getItem("player2") + " wins!";
    }
    //  else if (xCount == oCount && xCount>) {
    //   status = " Draw!";
    // }
    else if (sessionStorage.getItem("bb") == 0) {
      status =
        "Next player: " +
        (state.xIsNext
          ? `${sessionStorage.getItem("player1") || "Player 1"} (X)`
          : `${sessionStorage.getItem("player2") || "Player 2"} (O)`);
    }
  }
  if (status == "") {
    status = "Draw!";
  }
  if (status == undefined) {
    status = "Start";
  }
  return status;
}
