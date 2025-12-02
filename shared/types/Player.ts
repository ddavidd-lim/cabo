import Hand from "./Hand";

export default class Player {
  id: string;
  hand: Hand = new Hand();
  seat?: number;

  constructor(id: string, seat?: number) {
    this.id = id;
    if (seat !== undefined) this.seat = seat;
  }
}
