import Card from "./Card";

export default class Deck {
  private cards: Card[] = [];

  private suits = ["hearts", "diamonds", "clubs", "spades"];
  private ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  constructor() {
    this.reset();
  }

  // Deck will always be ordered
  reset() {
    this.cards = [];
    for (const suit of this.suits) {
      for (const rank of this.ranks) {
        this.cards.push(new Card(rank, suit));
      }
    }
  }

  // Fisher–Yates shuffle
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  draw(): Card | undefined {
    return this.cards.pop();
  }

  size() {
    return this.cards.length;
  }

  print() {
    console.log(this.cards.map((c) => c.toString()));
  }
}
