import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import GameBoard from './GameBoard';
import Scoreboard from './Scoreboard';

type Player = 'X' | 'O' | null;
type Board = Player[];
type GameStatus = 'playing' | 'win' | 'draw';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6] // diagonals
];

const TicTacToeGame = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [winner, setWinner] = useState<'X' | 'O' | null>(null);
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const { toast } = useToast();

  // Check for winner
  const checkWinner = useCallback((board: Board): { winner: Player; line: number[] } => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: combination };
      }
    }
    return { winner: null, line: [] };
  }, []);

  // Check if board is full
  const isBoardFull = useCallback((board: Board): boolean => {
    return board.every(cell => cell !== null);
  }, []);

  // AI move using minimax algorithm
  const getBestMove = useCallback((board: Board): number => {
    const minimax = (board: Board, depth: number, isMaximizing: boolean): number => {
      const { winner } = checkWinner(board);
      
      if (winner === 'O') return 10 - depth;
      if (winner === 'X') return depth - 10;
      if (isBoardFull(board)) return 0;

      if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
          if (board[i] === null) {
            board[i] = 'O';
            const score = minimax(board, depth + 1, false);
            board[i] = null;
            bestScore = Math.max(score, bestScore);
          }
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
          if (board[i] === null) {
            board[i] = 'X';
            const score = minimax(board, depth + 1, true);
            board[i] = null;
            bestScore = Math.min(score, bestScore);
          }
        }
        return bestScore;
      }
    };

    let bestMove = -1;
    let bestScore = -Infinity;
    
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        const score = minimax(board, 0, false);
        board[i] = null;
        
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    
    return bestMove;
  }, [checkWinner, isBoardFull]);

  // Make AI move
  const makeAiMove = useCallback(async () => {
    if (currentPlayer !== 'O' || gameStatus !== 'playing') return;
    
    setIsAiThinking(true);
    
    // Add delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const bestMove = getBestMove([...board]);
    
    if (bestMove !== -1) {
      setBoard(prev => {
        const newBoard = [...prev];
        newBoard[bestMove] = 'O';
        return newBoard;
      });
      setCurrentPlayer('X');
    }
    
    setIsAiThinking(false);
  }, [currentPlayer, gameStatus, board, getBestMove]);

  // Handle player move
  const handleCellClick = (index: number) => {
    if (board[index] !== null || gameStatus !== 'playing' || currentPlayer !== 'X' || isAiThinking) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setCurrentPlayer('O');
  };

  // Reset game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setGameStatus('playing');
    setWinner(null);
    setWinningLine([]);
    setIsAiThinking(false);
  };

  // Reset scores
  const resetScores = () => {
    setPlayerScore(0);
    setAiScore(0);
    resetGame();
    toast({
      title: "Scores Reset",
      description: "All scores have been reset to 0.",
    });
  };

  // Check game result
  useEffect(() => {
    const { winner: gameWinner, line } = checkWinner(board);
    
    if (gameWinner) {
      setWinner(gameWinner);
      setWinningLine(line);
      setGameStatus('win');
      
      if (gameWinner === 'X') {
        setPlayerScore(prev => prev + 1);
        toast({
          title: "Congratulations!",
          description: "You won this round!",
        });
      } else {
        setAiScore(prev => prev + 1);
        toast({
          title: "AI Wins",
          description: "Better luck next time!",
          variant: "destructive",
        });
      }
    } else if (isBoardFull(board)) {
      setGameStatus('draw');
      toast({
        title: "It's a Draw!",
        description: "Neither player won this round.",
      });
    }
  }, [board, checkWinner, isBoardFull, toast]);

  // AI move effect
  useEffect(() => {
    if (currentPlayer === 'O' && gameStatus === 'playing') {
      makeAiMove();
    }
  }, [currentPlayer, gameStatus, makeAiMove]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Tic Tac Toe
          </h1>
          <p className="text-muted-foreground">
            Challenge the AI in this classic game
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="flex justify-center">
            <GameBoard
              board={board}
              onCellClick={handleCellClick}
              disabled={gameStatus !== 'playing' || currentPlayer !== 'X' || isAiThinking}
              winningLine={winningLine}
            />
          </div>
          
          <div className="space-y-4">
            <Scoreboard
              playerScore={playerScore}
              aiScore={aiScore}
              currentPlayer={currentPlayer}
              gameStatus={gameStatus}
              winner={winner}
            />
            
            <div className="space-y-2">
              {gameStatus !== 'playing' && (
                <Button 
                  onClick={resetGame} 
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                  size="lg"
                >
                  Play Again
                </Button>
              )}
              
              <Button 
                onClick={resetScores} 
                variant="outline" 
                className="w-full"
                size="lg"
              >
                Reset Scores
              </Button>
            </div>
            
            {isAiThinking && (
              <div className="text-center text-muted-foreground animate-pulse">
                AI is thinking...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicTacToeGame;