import { Button } from "../ui/button";

type Props = {
  currentPlayerSeat: number;
  handleSelectSeat: (seat: number) => void;
};
export default function SeatSelection({ handleSelectSeat, currentPlayerSeat }: Props) {
  const seats = Array.from({ length: 4 }, (_, i) => i);
  console.log("currentPlayerSeat", currentPlayerSeat);
  return (
    <div className="w-100">
      <div className="flex flex-row gap-2">
        {seats.map((seat) => {
          if (seat === currentPlayerSeat) return null;

          return (
            <Button onClick={() => handleSelectSeat(seat)} className="h-40 w-25">
              Player {seat}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
