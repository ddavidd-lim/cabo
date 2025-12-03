import type { PendingSelection } from "@/types/PendingSelection";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import type Card from "../../../../shared/types/Card";
import type Player from "../../../../shared/types/Player";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import Hand from "./HandView";
import SeatSelection from "./SeatSelection";

type Props = {
  card: Card;
  self: Player;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selection: PendingSelection | null;
  handleSelectCard: (playerSeat: number | null, cardPosition: number | null) => void;
  description: string;
  phase: "selectSeat" | "selectOtherCard" | "selectSelfCard" | "";
};
export default function PowerDialog({
  card,
  self,
  open,
  setOpen,
  selection,
  handleSelectCard,
  description,
  phase,
}: Props) {
  const handleSelectSeat = (seat: number) => {
    handleSelectCard(seat, null);
  };

  useEffect(() => {}, [setOpen]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>You drew a {card?.rank}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {self && phase === "selectSelfCard" && (
          <Hand selection={selection} handleSelectCard={handleSelectCard} player={self} />
        )}
        {phase === "selectSeat" && (
          <SeatSelection currentPlayerSeat={self.seat ?? -1} handleSelectSeat={handleSelectSeat} />
        )}
      </DialogContent>
    </Dialog>
  );
}
