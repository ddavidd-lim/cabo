import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Card from "../../shared/types/Card";
import { type ClientGameState } from "../../shared/types/ClientGameState";
import { socket } from "./services/socket";
import Player from "../../shared/types/Player";
import Hand from "../../shared/types/Hand";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function App() {
  const [clientGameState, setClientGameState] = useState<ClientGameState>();
  const [card, setCard] = useState<Card>();
  const [power, setPower] = useState("");
  const [self, setSelf] = useState<Player | null>(null);
  const [open, setOpen] = useState(false);

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
  const handleEndGame = () => socket.emit("endGame");

  useEffect(() => {
    socket.on("listPlayersResult", (data) => {
      console.log("players: ", data);
    });

    socket.on("stateUpdate", (data: ClientGameState) => {
      console.log("state: ", data);
      setClientGameState(data);
      const player = new Player(data.self.id);
      player.hand = new Hand(data.self.hand.cards);
      setSelf(player);
    });

    socket.on("drawResult", (data) => {
      console.log("card: ", data);
      setCard(data);
    });

    socket.on("view", () => {
      setPower("view");
      setOpen(true);
    });
    socket.on("peek", () => {
      setPower("peek");
      setOpen(true);
    });
    socket.on("swap", () => {
      setPower("swap");
      setOpen(true);
    });
    socket.on("powerless", () => {
      setPower("powerless");
    });

    return () => {
      socket.off("listPlayersResult");
      socket.off("stateUpdate");
      socket.off("drawResult");
      socket.off("view");
      socket.off("peek");
      socket.off("swap");
      socket.off("powerless");
    };
  }, []);
  if (self) {
    console.log(self.hand);
  }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-2">
      <h4 className="font-semibold">{`${
        clientGameState?.players[clientGameState?.playerTurn]
      }'s turn`}</h4>
      <h4 className="font-semibold">Turn: {clientGameState?.turn}</h4>
      <h4 className="font-semibold">Phase: {clientGameState?.phase}</h4>
      {power && <h4 className="font-semibold">Power: {power}</h4>}
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
          <Button onClick={handleEndGame}>endGame</Button>
        </div>
        {self && self.hand && (
          <>
            <div className="flex flex-col gap-2">
              <Button onClick={handleDraw}>
                {self.hand.view(0)?.rank} | {self.hand.view(0)?.suit}
              </Button>
              <Button onClick={handleDraw}>
                {self.hand.view(1)?.rank} | {self.hand.view(1)?.suit}
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={handleDraw}>
                {self.hand.view(2)?.rank} | {self.hand.view(2)?.suit}
              </Button>
              <Button onClick={handleDraw}>
                {self.hand.view(3)?.rank} | {self.hand.view(3)?.suit}
              </Button>
            </div>
          </>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>You drew a {card?.rank}</DialogTitle>
            <DialogDescription>You may perform {power}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
