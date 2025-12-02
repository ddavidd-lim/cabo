import Hand from "./Hand";

export default class Player {
  id: string;
  hand: Hand = new Hand();

  constructor(id: string) {
    this.id = id;
  }
}
