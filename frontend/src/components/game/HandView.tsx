import type { PendingSelection } from "@/types/PendingSelection";
import type Player from "../../../../shared/types/Player";
import { Button } from "../ui/button";

// Saving this code here:
// {player.hand.view(2)?.rank} | {player.hand.view(3)?.suit}

type Props = {
  handleSelectCard: (playerSeat: number, cardPosition: number) => void;
  player: Player;
  selection: PendingSelection | null;
};
export default function HandView({ handleSelectCard, player, selection }: Props) {
  const disabled = player.seat === undefined || player.seat === null;

  const isSelected = (pos: number) =>
    selection?.playerSeat === player.seat && selection?.cardPosition === pos;

  return (
    <div className="w-100">
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <Button
            disabled={disabled}
            onClick={() => handleSelectCard(player.seat!, 0)}
            className={`h-40 w-25 ${
              isSelected(0) ? "bg-red-500 text-white hover:bg-red-600" : ""
            }`}>
            1 {player.hand.view(0)?.rank} | {player.hand.view(0)?.suit}
          </Button>
          <Button
            disabled={disabled}
            onClick={() => handleSelectCard(player.seat!, 3)}
            className={`h-40 w-25 ${
              isSelected(3) ? "bg-red-500 text-white hover:bg-red-600" : ""
            }`}>
            4 {player.hand.view(3)?.rank} | {player.hand.view(3)?.suit}
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            disabled={disabled}
            onClick={() => handleSelectCard(player.seat!, 1)}
            className={`h-40 w-25 ${
              isSelected(1) ? "bg-red-500 text-white hover:bg-red-600" : ""
            }`}>
            2 {player.hand.view(1)?.rank} | {player.hand.view(1)?.suit}
          </Button>
          <Button
            disabled={disabled}
            onClick={() => handleSelectCard(player.seat!, 2)}
            className={`h-40 w-25 ${
              isSelected(2) ? "bg-red-500 text-white hover:bg-red-600" : ""
            }`}>
            3 {player.hand.view(2)?.rank} | {player.hand.view(2)?.suit}
          </Button>
        </div>
      </div>
    </div>
  );
}
