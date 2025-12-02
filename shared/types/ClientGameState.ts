import Player from "./Player";

export type ClientGameState = {
  players: ({ id: string } | Player)[];
  turn: number;
  phase: string;
  cabo: boolean;
  playerTurn: number;
};
