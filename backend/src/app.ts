import express from "express";
import { createWebsocketServer } from "./server/socket";

const app = express();
const port = 3000;

const { httpServer } = createWebsocketServer();

httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Cabo

// Game Rules
// Player with least # of pts wins
// If there is a tie, the player who called cabo WINS
// If there is a tie between people who didn't call, whoever had the lowest score in the last round wins

// 4 players
// Player has 4 cards
// Location matters

// Deck
// 52 cards
// Shuffle
// Deal card

// Card
// 7/8 - Look at own card
// 9/10 - Look at another's card
// J/Q - Blind swap 2 cards
// Red King - Worth -1 pts
// Black King - Worth 21 pts
