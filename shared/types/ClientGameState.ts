import Player from "./Player";

export type PlayerInfo = {
  id: string;
  seat?: number;
};
export type ClientGameState = {
  players: PlayerInfo[];
  self: Player;
  turn: number;
  phase: string;
  cabo: boolean;
  playerTurn: number;
};
