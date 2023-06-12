import React, { useState, useEffect } from "react";

const PlayerName = () => {
  const [Name1, setName1] = useState(sessionStorage.getItem("player11") || "");
  const [Name2, setName2] = useState(sessionStorage.getItem("player22") || "");
  const handleFirstPlayerName = (event) => {
    setName1(event.target.value);
    sessionStorage.setItem("player1", event.target.value);
    sessionStorage.setItem("player11", event.target.value);
  };
  const handleSecondPlayerName = (event) => {
    setName2(event.target.value);
    sessionStorage.setItem("player2", event.target.value);
    sessionStorage.setItem("player22", event.target.value);
  };
  
  return (
    <div className="nameWrapper">
      <section className="nameContainer">
        <h3 className="playerName">Enter Player Name</h3>
        <input
          type="text"
          className="enterName"
          onChange={handleFirstPlayerName}
          value={Name1}
          // value={sessionStorage.getItem("player1")}
        />
      </section>
      <section className="nameContainer">
        <h3 className="playerName">Enter Player Name</h3>
        <input
          type="text"
          className="enterName"
          value={Name2}
          onChange={handleSecondPlayerName}
          // value={sessionStorage.getItem("player2")}
        />
      </section>
    </div>
  );
};

export default PlayerName;
