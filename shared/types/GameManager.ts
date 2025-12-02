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
    console.log(`assigned seat ${this.state.players.length} to ${id}`);
    this.state.players.push(new Player(id, this.state.players.length));
  }

  startGame() {
    this.state.deck.shuffle();

    for (let i = 0; i < 4; i++) {
      for (const player of this.state.players) {
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

  swap(p1: number, p1cardPos: number, p2: number, p2cardPos: number) {
    const player1 = this.state.players[p1];
    const player2 = this.state.players[p2];
    if (!player1 || !player2) return false;

    const c1 = player1.hand.view(p1cardPos);
    const c2 = player2.hand.view(p2cardPos);
    if (!c1 || !c2) return false;

    player1.hand.replace(p1cardPos, c2);
    player2.hand.replace(p2cardPos, c1);
    return true;
  }

  peek(playerSeat: number, cardPosition: number) {
    const player = this.state.players[playerSeat];
    if (!player) return null;

    const card = player.hand.view(cardPosition);
    if (!card) return null;

    return { rank: card.rank };
  }

  replaceCard(playerSeat: number, cardPosition: number) {
    console.log(`playerSeat: ${playerSeat}\ncardPosition: ${cardPosition}`);
    console.log(`players: `, this.state.players.length);
    console.log(`player seat 0: `, this.state.players[0]);
    const player = this.state.players[playerSeat];
    if (!player) {
      console.error("no player found");
      return null;
    }

    const card = player.hand.view(cardPosition);
    if (!card) {
      console.error("no card found");
      return null;
    }

    if (!this.state.currentCard) return null;

    player.hand.replace(cardPosition, this.state.currentCard);
    console.log("Successfully replaced card");
    return true;
  }

  callCabo() {}

  usePower() {}

  nextTurn() {
    this.state.playerTurn = (this.state.turn + 1) % this.state.players.length;
    this.state.turn += 1;
  }

  getClientGameState(playerId: string): ClientGameState {
    const gameState = this.state;
    const self = gameState.players.find((player) => player.id === playerId);

    if (!self) throw new Error(`Player with ID ${playerId} not found`);
    return {
      players: gameState.players.map(({ id, seat }) => ({ id, seat })),
      self: { id: self.id, seat: self.seat, hand: self.hand },
      turn: gameState.turn,
      phase: gameState.phase,
      cabo: gameState.cabo,
      playerTurn: gameState.playerTurn,
    };
  }
}
