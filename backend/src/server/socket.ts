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

    socket.on("peek", ({ playerIndex, pos }) => {
      const card = game.peek(playerIndex, pos);
      socket.emit("peekResult", card);
    });

    socket.on("swap", (data) => {
      const ok = game.swap(data.p1, data.p1pos, data.p2, data.p2pos);
      if (ok) io.emit("stateUpdate", game.state);
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

      switch (Number(card?.rank)) {
        case 7:
        case 8:
          console.log("view");
          socket.emit("view");
          break;

        case 9:
        case 10:
          console.log("view");
          socket.emit("peek");
          break;

        case 11:
        case 12:
          console.log("view");
          socket.emit("swap");

          break;

        default:
          socket.emit("powerless");
          break;
      }
    });
  });

  return { io, httpServer };
}
