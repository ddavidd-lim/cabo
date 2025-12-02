import Card from "./Card";

export default class Hand {
  private cards: Array<Card | null> = [];

  constructor(cards?: Card[]) {
    this.cards = cards ?? [];
  }

  view(position: number): Card | null {
    const card = this.cards[position];
    if (!card) return null;

    return card;
  }

  add(card: Card) {
    this.cards.push(card);

    return true;
  }

  remove(position: number) {
    const card = this.cards[position];
    if (!card) return null;
    this.cards[position] = null;

    return true;
  }

  replace(position: number, card: Card) {
    if (!this.cards[position]) return null;

    this.cards[position] = card;
    return true;
  }
}
