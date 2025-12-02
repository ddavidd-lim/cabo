import Player from "./Player";

export type ClientGameState = {
  players: string[];
  self: Player;
  turn: number;
  phase: string;
  cabo: boolean;
  playerTurn: number;
};
