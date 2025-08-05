import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScoreboardProps {
  playerScore: number;
  aiScore: number;
  currentPlayer: 'X' | 'O';
  gameStatus: 'playing' | 'win' | 'draw';
  winner?: 'X' | 'O' | null;
}

const Scoreboard = ({ 
  playerScore, 
  aiScore, 
  currentPlayer, 
  gameStatus,
  winner 
}: ScoreboardProps) => {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-center text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Tic Tac Toe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-center space-y-1">
            <div className="text-sm text-muted-foreground">Player (X)</div>
            <div className="text-2xl font-bold text-game-player-x">{playerScore}</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-sm text-muted-foreground">AI (O)</div>
            <div className="text-2xl font-bold text-game-player-o">{aiScore}</div>
          </div>
        </div>
        
        <div className="text-center">
          {gameStatus === 'playing' && (
            <Badge variant="outline" className="text-base px-4 py-2">
              {currentPlayer === 'X' ? 'Your Turn' : 'AI Turn'}
            </Badge>
          )}
          {gameStatus === 'win' && winner && (
            <Badge 
              variant="default" 
              className={`text-base px-4 py-2 ${
                winner === 'X' 
                  ? 'bg-game-player-x text-primary-foreground' 
                  : 'bg-game-player-o text-accent-foreground'
              }`}
            >
              {winner === 'X' ? 'You Win!' : 'AI Wins!'}
            </Badge>
          )}
          {gameStatus === 'draw' && (
            <Badge variant="secondary" className="text-base px-4 py-2">
              It's a Draw!
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Scoreboard;