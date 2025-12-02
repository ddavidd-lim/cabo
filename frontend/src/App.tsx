import { Button } from "@/components/ui/button";
import { socket } from "./services/socket";
import { useEffect, useState } from "react";
import GameState from "../../shared/types/GameState";
import Card from "../../shared/types/Card";

function App() {
  const [gameState, setGameState] = useState<GameState>();
  const [card, setCard] = useState<Card>();

  const handleListPlayers = () => {
    socket.emit("listPlayers");
  };

  const handleClearPlayers = () => {
    socket.emit("clearPlayers");
  };

  const handlePeekCard = () => {
    socket.emit("peekCard");
  };

  const handleSwapCards = () => {
    socket.emit("swapCard");
  };

  const handleDraw = () => {
    socket.emit("draw");
  };

  const handleCallCabo = () => {
    socket.emit("callCabo");
  };

  const handleStartGame = () => socket.emit("startGame");

  useEffect(() => {
    socket.on("listPlayersResult", (data) => {
      console.log("players: ", data);
    });

    socket.on("stateUpdate", (data) => {
      console.log("state: ", data);
      setGameState(data);
    });

    socket.on("drawResult", (data) => {
      console.log("card: ", data);
      setCard(data);
    });

    return () => {
      socket.off("listPlayersResult");
      socket.off("stateUpdate");
      socket.off("drawResult");
    };
  }, []);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-2">
      <h4 className="font-semibold">{`${gameState?.players[gameState?.playerTurn].id}'s turn`}</h4>
      <h4 className="font-semibold">Turn: {gameState?.turn}</h4>
      <h4 className="font-semibold">Phase: {gameState?.phase}</h4>
      <h4 className="font-semibold">
        Card: {card?.rank} of {card?.suit}
      </h4>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <Button onClick={handleDraw}>draw</Button>
          <Button onClick={handleListPlayers}>listPlayers</Button>
          <Button onClick={handleClearPlayers}>clearPlayers</Button>
          <Button onClick={handlePeekCard}>peekCard</Button>
          <Button onClick={handleSwapCards}>swapCards</Button>
          <Button onClick={handleCallCabo}>callCabo</Button>
          <Button onClick={handleStartGame}>startGame</Button>
        </div>
        <div className="flex flex-col gap-2">
          <Button onClick={handleDraw}>card 0</Button>
          <Button onClick={handleDraw}>card 1</Button>
        </div>
        <div className="flex flex-col gap-2">
          <Button onClick={handleDraw}>card 2</Button>
          <Button onClick={handleDraw}>card 3</Button>
        </div>
      </div>
    </div>
  );
}

export default App;
