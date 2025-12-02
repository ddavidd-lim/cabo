import { ClientGameState } from "./ClientGameState";
import Deck from "./Deck";
import GameState from "./GameState";
import Player from "./Player";

export default class GameManager {
  state: GameState;

  constructor() {
    this.state = new GameState();
  }

  addPlayer(id: string) {
    this.state.players.push(new Player(id));
  }

  startGame() {
    this.state.deck.shuffle();

    for (let i = 0; i < 4; i++) {
      for (const player of this.state.players) {
        console.log(`dealing to ${player.id}`);
        const card = this.state.deck.draw();
        if (!!card) player.hand.add(card);
      }
    }
  }

  endGame() {
    this.state.deck = new Deck();

    for (const player of this.state.players) {
      player.hand.cards = [];
    }
  }

  swap(p1: number, p1pos: number, p2: number, p2pos: number) {
    const player1 = this.state.players[p1];
    const player2 = this.state.players[p2];
    if (!player1 || !player2) return false;

    const c1 = player1.hand.view(p1pos);
    const c2 = player2.hand.view(p2pos);
    if (!c1 || !c2) return false;

    player1.hand.replace(p1pos, c2);
    player2.hand.replace(p2pos, c1);
    return true;
  }

  peek(playerPosition: number, cardPosition: number) {
    const player = this.state.players[playerPosition];
    const card = player.hand.view(cardPosition);

    if (!player) return null;
    if (!card) return null;

    return { rank: card.rank };
  }

  callCabo() {}

  usePower() {}

  nextTurn() {
    this.state.playerTurn = (this.state.turn + 1) % this.state.players.length;
    this.state.turn += 1;
  }

  getClientGameState(playerId: string): ClientGameState {
    const gameState = this.state;

    return {
      players: gameState.players.map((p) => p.id),
      self: gameState.players.find((player) => player.id === playerId)!,
      turn: gameState.turn,
      phase: gameState.phase,
      cabo: gameState.cabo,
      playerTurn: gameState.playerTurn,
    };
  }
}
