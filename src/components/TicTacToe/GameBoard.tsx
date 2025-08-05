import { cn } from "@/lib/utils";
import GameCell from "./GameCell";

type Player = 'X' | 'O' | null;
type Board = Player[];

interface GameBoardProps {
  board: Board;
  onCellClick: (index: number) => void;
  disabled: boolean;
  winningLine?: number[];
}

const GameBoard = ({ board, onCellClick, disabled, winningLine = [] }: GameBoardProps) => {
  return (
    <div className={cn(
      "grid grid-cols-3 gap-3 p-6 rounded-2xl",
      "bg-gradient-board border-2 border-border/50",
      "shadow-xl backdrop-blur-sm"
    )}>
      {board.map((cell, index) => (
        <GameCell
          key={index}
          value={cell}
          onClick={() => onCellClick(index)}
          disabled={disabled}
          isWinning={winningLine.includes(index)}
        />
      ))}
    </div>
  );
};

export default GameBoard;