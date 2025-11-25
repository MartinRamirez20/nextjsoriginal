'use client';

import { useState } from 'react';
import { RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

type Cell = 'red' | 'yellow' | null;
type Board = Cell[][];

const ROWS = 6;
const COLS = 7;

const ConnectFour: React.FC = () => {
  const [board, setBoard] = useState<Board>(
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<'red' | 'yellow'>('red');
  const [winner, setWinner] = useState<string | null>(null);
  const [winningCells, setWinningCells] = useState<Set<string>>(new Set());

  const checkWinner = (board: Board, row: number, col: number): boolean => {
    const player = board[row][col];
    if (!player) return false;

    const directions = [
      { dr: 0, dc: 1 },  // horizontal
      { dr: 1, dc: 0 },  // vertical
      { dr: 1, dc: 1 },  // diagonal \
      { dr: 1, dc: -1 }  // diagonal /
    ];

    for (const { dr, dc } of directions) {
      const cells: [number, number][] = [[row, col]];
      
      // Check positive direction
      for (let i = 1; i < 4; i++) {
        const r = row + dr * i;
        const c = col + dc * i;
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
          cells.push([r, c]);
        } else break;
      }
      
      // Check negative direction
      for (let i = 1; i < 4; i++) {
        const r = row - dr * i;
        const c = col - dc * i;
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
          cells.push([r, c]);
        } else break;
      }

      if (cells.length >= 4) {
        setWinningCells(new Set(cells.map(([r, c]) => `${r}-${c}`)));
        return true;
      }
    }

    return false;
  };

  const dropPiece = (col: number) => {
    if (winner) return;

    // Find the lowest empty row in this column
    let row = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === null) {
        row = r;
        break;
      }
    }

    if (row === -1) return; // Column is full

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    if (checkWinner(newBoard, row, col)) {
      setWinner(currentPlayer);
    } else if (newBoard.every(row => row.every(cell => cell !== null))) {
      setWinner('draw');
    } else {
      setCurrentPlayer(currentPlayer === 'red' ? 'yellow' : 'red');
    }
  };

  const resetGame = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setCurrentPlayer('red');
    setWinner(null);
    setWinningCells(new Set());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
      <div className="mb-4">
          <Link href="/">
            <button className="bg-white/10 text-white px-4 py-2 rounded-lg font-bold hover:bg-white/20 transition-all flex items-center gap-2">
              <Home className="w-5 h-5" />
              ← Volver al Menú
            </button>
          </Link>
        </div>
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-white mb-4">Connect Four</h1>
          
          {winner ? (
            <div className="space-y-4">
              <p className="text-2xl font-semibold text-white">
                {winner === 'draw' ? "It's a Draw!" : `${winner.charAt(0).toUpperCase() + winner.slice(1)} Wins! 🎉`}
              </p>
              <button
                onClick={resetGame}
                className="bg-white text-purple-900 px-6 py-3 rounded-xl font-semibold hover:bg-purple-100 transition-all transform hover:scale-105 inline-flex items-center gap-2"
              >
                <RotateCcw size={20} />
                New Game
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <p className="text-xl text-white">Current Player:</p>
              <div className={`w-8 h-8 rounded-full ${currentPlayer === 'red' ? 'bg-red-500' : 'bg-yellow-400'} shadow-lg`} />
            </div>
          )}
        </div>

        <div className="bg-blue-600 rounded-2xl p-4 shadow-2xl">
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const isWinning = winningCells.has(`${rowIndex}-${colIndex}`);
                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => dropPiece(colIndex)}
                    disabled={!!winner}
                    className={`w-14 h-14 rounded-full transition-all transform ${
                      !winner && !cell ? 'hover:scale-110 cursor-pointer' : ''
                    } ${
                      cell === 'red' 
                        ? `bg-red-500 ${isWinning ? 'ring-4 ring-white animate-pulse' : ''}` 
                        : cell === 'yellow' 
                        ? `bg-yellow-400 ${isWinning ? 'ring-4 ring-white animate-pulse' : ''}` 
                        : 'bg-white/90'
                    } shadow-inner`}
                  />
                );
              })
            )}
          </div>
        </div>

        {!winner && (
          <div className="mt-6 text-center">
            <button
              onClick={resetGame}
              className="bg-white/20 text-white px-5 py-2 rounded-lg font-medium hover:bg-white/30 transition-all inline-flex items-center gap-2 backdrop-blur"
            >
              <RotateCcw size={18} />
              Reset
            </button>
          </div>
        )}

        <div className="mt-6 text-white/70 text-sm text-center">
          <p>Click on a column to drop your piece</p>
          <p className="mt-1">Connect 4 pieces in a row to win!</p>
        </div>
      </div>
    </div>
  );
};

export default ConnectFour;