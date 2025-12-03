import { createServer } from "http";
import { Server } from "socket.io";
import GameManager from "../../../shared/types/GameManager";

export function createWebsocketServer() {
  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });
  const game = new GameManager();

  io.on("connection", (socket) => {
    console.log("Player connected:", socket.id);

    game.addPlayer(socket.id);

    io.emit("stateUpdate", game.getClientGameState(socket.id));

    socket.on("startGame", () => {
      game.startGame();
      io.emit("stateUpdate", game.getClientGameState(socket.id));
    });

    socket.on("endGame", () => {
      game.endGame();
      io.emit("stateUpdate", game.getClientGameState(socket.id));
    });

    socket.on("view", ({ playerSeat, pos }) => {
      const card = game.state.players[playerSeat].hand.view(pos);
      socket.emit("viewResult", card);
    });

    socket.on("peek", ({ playerSeat, pos }) => {
      const card = game.peek(playerSeat, pos);
      socket.emit("peekResult", card);
    });

    socket.on("swap", (data) => {
      const success = game.swap(data.p1, data.p1pos, data.p2, data.p2pos);
      if (success) io.emit("stateUpdate", game.getClientGameState(socket.id));
    });

    socket.on("replace", (playerSeat, cardPosition) => {
      const success = game.replaceCard(playerSeat, cardPosition);
      game.nextTurn();
      if (success) io.emit("stateUpdate", game.getClientGameState(socket.id));
    });

    socket.on("listPlayers", () => {
      console.log("listPlayers");
      socket.emit("listPlayersResult", game.state.players);
    });

    socket.on("clearPlayers", () => {
      game.state.players = [];
      console.log("clearPlayers");
      socket.emit("clearPlayersResult", game.state.players);
    });

    socket.on("draw", () => {
      const card = game.state.deck.draw();
      console.log("draw");
      socket.emit("drawResult", card);
      game.state.currentCard = card;

      switch (Number(card?.rank)) {
        case 7:
        case 8:
          console.log("viewSelf");
          socket.emit("viewSelf");
          break;

        case 9:
        case 10:
          console.log("peekOther");
          socket.emit("peekOther");
          break;

        case 11:
        case 12:
          console.log("swap");
          socket.emit("swap");

          break;

        default:
          console.log("powerless");
          socket.emit("powerless");
          break;
      }
    });

    socket.on("endTurn", () => {
      game.nextTurn();
      io.emit("stateUpdate", game.getClientGameState(socket.id));
    });
  });

  return { io, httpServer };
}
