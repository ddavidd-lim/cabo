import { socket } from "@/services/socket";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type Card from "../../../../shared/types/Card";
import type Player from "../../../../shared/types/Player";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import Hand from "./HandView";
import SeatSelection from "./SeatSelection";
import type { PendingSelection } from "@/types/PendingSelection";

type Props = {
  card: Card;
  self: Player;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selection: PendingSelection | null;
};
export default function PowerDialog({ card, self, open, setOpen, selection }: Props) {
  const [description, setDescription] = useState("");
  const [phase, setPhase] = useState<"selectSeat" | "selectOtherCard" | "selectSelfCard">();

  const handleSelectCard = () => {
    socket.emit("selectCard");
  };

  useEffect(() => {
    socket.on("viewSelf", () => {
      setOpen(true);
      setDescription(`You may look at one of your own cards.`);
      setPhase("selectSelfCard");
    });
    socket.on("peekOther", () => {
      setOpen(true);
      setDescription(`You may look at one of your opponents' cards.`);
      setPhase("selectSeat");
    });
    socket.on("swap", () => {
      setOpen(true);
      setDescription(`You may blind swap any two cards.`);
      setPhase("selectSeat");
    });
    socket.on("powerless", () => {});
    return () => {
      socket.off("viewSelf");
      socket.off("peekOther");
      socket.off("swap");
      socket.off("powerless");
    };
  }, [setOpen]);
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
          <SeatSelection currentPlayerSeat={self.seat ?? -1} handleSelectSeat={handleSelectCard} />
        )}
      </DialogContent>
    </Dialog>
  );
}
