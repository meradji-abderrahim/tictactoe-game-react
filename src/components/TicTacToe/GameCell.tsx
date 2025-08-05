import { cn } from "@/lib/utils";

interface GameCellProps {
  value: 'X' | 'O' | null;
  onClick: () => void;
  disabled: boolean;
  isWinning?: boolean;
}

const GameCell = ({ value, onClick, disabled, isWinning = false }: GameCellProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || value !== null}
      className={cn(
        "w-24 h-24 bg-game-cell border-2 border-border rounded-lg",
        "flex items-center justify-center text-4xl font-bold",
        "transition-all duration-300 ease-smooth",
        "hover:bg-game-cell-hover hover:border-primary/50 hover:shadow-glow",
        "disabled:cursor-not-allowed",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
        {
          "shadow-winning border-game-winning-glow animate-pulse": isWinning,
          "text-game-player-x": value === 'X',
          "text-game-player-o": value === 'O',
        }
      )}
    >
      {value && (
        <span 
          className={cn(
            "drop-shadow-lg transition-all duration-200",
            "animate-in zoom-in-50",
            {
              "filter drop-shadow-[0_0_8px_hsl(var(--player-x))]": value === 'X',
              "filter drop-shadow-[0_0_8px_hsl(var(--player-o))]": value === 'O',
            }
          )}
        >
          {value}
        </span>
      )}
    </button>
  );
};

export default GameCell;