import type Card from "./Card";
import Deck from "./Deck";
import Player from "./Player";

export default class GameState {
  deck: Deck = new Deck();
  players: Player[] = [];
  playerTurn: number = 0;
  finalTurn: number = -1;
  turn: number = 0;
  cabo: boolean = false;
  discardPile: Card[] = [];
  phase: "waiting" | "dealing" | "playerTurn" | "roundEnd" = "waiting";
}
