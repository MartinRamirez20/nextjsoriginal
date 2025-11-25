'use client';

import { useState } from 'react';
import { RotateCcw, X, Circle, Home } from 'lucide-react';
import Link from 'next/link';

type Cell = 'X' | 'O' | null;
type Board = Cell[];

const TicTacToe = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [gameMode, setGameMode] = useState<'pvp' | 'ai' | null>(null);

  const calculateWinner = (squares: Board): { winner: Cell; line: number[] | null } => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    return { winner: null, line: null };
  };

  const { winner, line } = calculateWinner(board);
  const isDraw = !winner && board.every(cell => cell !== null);

  const findBestMove = (squares: Board): number => {
    // Try to win
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        const testBoard = [...squares];
        testBoard[i] = 'O';
        if (calculateWinner(testBoard).winner === 'O') return i;
      }
    }

    // Block opponent's win
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        const testBoard = [...squares];
        testBoard[i] = 'X';
        if (calculateWinner(testBoard).winner === 'X') return i;
      }
    }

    // Take center if available
    if (!squares[4]) return 4;

    // Take a corner
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => !squares[i]);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available space
    const available = squares.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    return available[Math.floor(Math.random() * available.length)] || 0;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner || isDraw) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    const result = calculateWinner(newBoard);
    if (result.winner) {
      setScores(prev => ({
        ...prev,
        [result.winner!]: prev[result.winner as 'X' | 'O'] + 1
      }));
      setIsXNext(true);
      return;
    }

    const isDrawNow = newBoard.every(cell => cell !== null);
    if (isDrawNow) {
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      setIsXNext(true);
      return;
    }

    setIsXNext(!isXNext);

    // AI move
    if (gameMode === 'ai' && isXNext) {
      setTimeout(() => {
        const aiMove = findBestMove(newBoard);
        const aiBoard = [...newBoard];
        aiBoard[aiMove] = 'O';
        setBoard(aiBoard);

        const aiResult = calculateWinner(aiBoard);
        if (aiResult.winner) {
          setScores(prev => ({ ...prev, O: prev.O + 1 }));
        } else if (aiBoard.every(cell => cell !== null)) {
          setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
        }
        setIsXNext(true);
      }, 500);
    }
  };

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  const resetAll = () => {
    resetBoard();
    setScores({ X: 0, O: 0, draws: 0 });
    setGameMode(null);
  };

  const startGame = (mode: 'pvp' | 'ai') => {
    setGameMode(mode);
    resetBoard();
  };

  if (!gameMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="mb-4">
            <Link href="/">
              <button className="bg-white/10 text-white px-4 py-2 rounded-lg font-bold hover:bg-white/20 transition-all flex items-center gap-2">
                <Home className="w-5 h-5" />
                ← Volver al Menú
              </button>
            </Link>
          </div>
          
          <div className="bg-white rounded-3xl p-12 shadow-2xl text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-3">Tic Tac Toe</h1>
            <p className="text-gray-600 mb-8">Choose your game mode</p>
            
            <div className="space-y-4">
              <button
                onClick={() => startGame('pvp')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                👥 Player vs Player
              </button>
              <button
                onClick={() => startGame('ai')}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🤖 Player vs AI
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="mb-4">
          <Link href="/">
            <button className="bg-white/10 text-white px-4 py-2 rounded-lg font-bold hover:bg-white/20 transition-all flex items-center gap-2">
              <Home className="w-5 h-5" />
              ← Volver al Menú
            </button>
          </Link>
        </div>
        
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Tic Tac Toe</h1>
          <button
            onClick={resetAll}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-lg transition-all"
            title="Back to menu"
          >
            <RotateCcw size={20} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6 bg-purple-100 p-3 rounded-xl">
          <div className="text-center bg-white rounded-lg py-2">
            <div className="text-blue-600 font-bold text-sm">Player X</div>
            <div className="text-2xl font-bold text-gray-800">{scores.X}</div>
          </div>
          <div className="text-center bg-white rounded-lg py-2">
            <div className="text-gray-600 font-bold text-sm">Draws</div>
            <div className="text-2xl font-bold text-gray-800">{scores.draws}</div>
          </div>
          <div className="text-center bg-white rounded-lg py-2">
            <div className="text-red-600 font-bold text-sm">Player O</div>
            <div className="text-2xl font-bold text-gray-800">{scores.O}</div>
          </div>
        </div>

        <div className="mb-6">
          {winner ? (
            <div className="text-center py-3 bg-gradient-to-r from-green-400 to-green-500 rounded-xl">
              <p className="text-2xl font-bold text-white">
                {winner === 'X' ? '🎉 Player X Wins!' : gameMode === 'ai' ? '🤖 AI Wins!' : '🎉 Player O Wins!'}
              </p>
            </div>
          ) : isDraw ? (
            <div className="text-center py-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl">
              <p className="text-2xl font-bold text-white">🤝 It's a Draw!</p>
            </div>
          ) : (
            <div className="text-center py-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl">
              <p className="text-xl font-bold text-white">
                {isXNext ? "X's Turn" : gameMode === 'ai' ? "AI's Turn..." : "O's Turn"}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {board.map((cell, index) => {
            const isWinningCell = line?.includes(index);
            return (
              <button
                key={index}
                onClick={() => handleClick(index)}
                disabled={!!cell || !!winner || isDraw || (gameMode === 'ai' && !isXNext)}
                className={`aspect-square rounded-xl text-5xl font-bold transition-all transform hover:scale-105 ${
                  isWinningCell
                    ? 'bg-gradient-to-br from-green-400 to-green-500 shadow-lg'
                    : 'bg-gradient-to-br from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200'
                } ${
                  cell ? 'cursor-default' : 'cursor-pointer'
                } disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center shadow-md`}
              >
                {cell === 'X' && <X size={60} className={isWinningCell ? 'text-white' : 'text-blue-600'} strokeWidth={3} />}
                {cell === 'O' && <Circle size={60} className={isWinningCell ? 'text-white' : 'text-red-600'} strokeWidth={3} />}
              </button>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={resetBoard}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            New Round
          </button>
          <button
            onClick={resetAll}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105"
          >
            Change Mode
          </button>
        </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            {gameMode === 'ai' ? 'Playing against AI' : 'Local multiplayer'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;