import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Card from "../../shared/types/Card";
import { type ClientGameState } from "../../shared/types/ClientGameState";
import Hand from "../../shared/types/Hand";
import Player from "../../shared/types/Player";
import { socket } from "./services/socket";
import PowerDialog from "./components/game/PowerDialog";
import HandView from "./components/game/HandView";
import type { PendingSelection } from "./types/PendingSelection";

type SelectedCards = {
  playerSeat: number;
  cardPosition: number;
};
function App() {
  const [clientGameState, setClientGameState] = useState<ClientGameState>();
  const [drawnCard, setDrawnCard] = useState<Card>();
  const [self, setSelf] = useState<Player | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedCards, setSelectedCards] = useState<SelectedCards[]>();
  const [selection, setSelection] = useState<PendingSelection | null>(null);

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

  const handleEndTurn = () => {
    socket.emit("endTurn");
  };

  const handleOpenPowerDialog = () => {
    setOpen((prev) => !prev);
  };

  const handleReplaceCard = () => {
    if (!selection || selection.playerSeat === null || selection.cardPosition === null) return null;
    socket.emit("replace", selection.playerSeat, selection.cardPosition);
  };

  const handleSelectCard = (playerSeat: number, cardPosition: number) => {
    if (selection?.playerSeat === playerSeat && selection.cardPosition === cardPosition) {
      setSelection(null);
    } else {
      setSelection({ playerSeat, cardPosition });
    }
  };

  const handleStartGame = () => socket.emit("startGame");
  const handleEndGame = () => socket.emit("endGame");

  useEffect(() => {
    socket.on("listPlayersResult", (data) => {
      console.log("players: ", data);
    });

    socket.on("stateUpdate", (data: ClientGameState) => {
      setClientGameState(data);
      const player = new Player(data.self.id);
      player.hand = new Hand(data.self.hand.cards);
      player.seat = data.self.seat;
      setSelf(player);
    });

    socket.on("drawResult", (data) => {
      console.log("card: ", data);
      setDrawnCard(data);
    });

    return () => {
      socket.off("listPlayersResult");
      socket.off("stateUpdate");
      socket.off("drawResult");
    };
  }, []);

  const currentPlayer = clientGameState?.players[clientGameState?.playerTurn];
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-2">
      <h4 className="font-semibold">
        {`${currentPlayer?.id}'s turn`}, seat {currentPlayer?.seat}
      </h4>
      <h4 className="font-semibold">
        You: {self?.id} | seat: {self?.seat}
      </h4>
      <h4 className="font-semibold">Turn: {clientGameState?.turn}</h4>
      <h4 className="font-semibold">Phase: {clientGameState?.phase}</h4>
      <h4 className="font-semibold">
        {drawnCard && `Card: ${drawnCard.rank} of ${drawnCard.suit}`}
      </h4>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <Button onClick={handleDraw}>draw</Button>
          <Button onClick={handleEndTurn}>endTurn</Button>
          <Button onClick={handleReplaceCard}>submitReplaceCard</Button>
          <Button onClick={handleOpenPowerDialog}>openPowerDialog</Button>
          <Button onClick={handleListPlayers}>listPlayers</Button>
          <Button onClick={handleClearPlayers}>clearPlayers</Button>
          <Button onClick={handlePeekCard}>peekCard</Button>
          <Button onClick={handleSwapCards}>swapCards</Button>
          <Button onClick={handleCallCabo}>callCabo</Button>
          <Button onClick={handleStartGame}>startGame</Button>
          <Button onClick={handleEndGame}>endGame</Button>
        </div>
        {self && self.hand && (
          <HandView selection={selection} handleSelectCard={handleSelectCard} player={self} />
        )}
      </div>
      {drawnCard && self && (
        <PowerDialog
          selection={selection}
          open={open}
          setOpen={setOpen}
          card={drawnCard}
          self={self}
        />
      )}
    </div>
  );
}

export default App;
