'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Trophy, Clock, Home } from 'lucide-react';
import Link from 'next/link';

interface Color {
  id: string;
  name: string;
  rgb: [number, number, number];
  emoji: string;
}

interface TargetColor {
  rgb: [number, number, number];
  recipe: Color[];
  hint: string;
}

type GameState = 'playing' | 'success' | 'gameover';

export default function ColorAlchemy() {
  const [selectedColors, setSelectedColors] = useState<Color[]>([]);
  const [targetColor, setTargetColor] = useState<TargetColor | null>(null);
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [feedback, setFeedback] = useState<string>('');

  const baseColors: Color[] = [
    { id: 'red', name: 'Rojo', rgb: [255, 0, 0], emoji: '🔴' },
    { id: 'blue', name: 'Azul', rgb: [0, 0, 255], emoji: '🔵' },
    { id: 'yellow', name: 'Amarillo', rgb: [255, 255, 0], emoji: '🟡' },
    { id: 'green', name: 'Verde', rgb: [0, 255, 0], emoji: '🟢' },
    { id: 'purple', name: 'Morado', rgb: [128, 0, 128], emoji: '🟣' },
    { id: 'orange', name: 'Naranja', rgb: [255, 165, 0], emoji: '🟠' },
  ];

  const generateTargetColor = (): TargetColor => {
    const numColors = Math.min(2 + Math.floor(level / 3), 3);
    const shuffled = [...baseColors].sort(() => Math.random() - 0.5);
    const colorsToMix = shuffled.slice(0, numColors);
    
    const mixedRgb = colorsToMix.reduce((acc, color) => {
      return [
        acc[0] + color.rgb[0],
        acc[1] + color.rgb[1],
        acc[2] + color.rgb[2]
      ] as [number, number, number];
    }, [0, 0, 0] as [number, number, number]).map(v => Math.floor(v / numColors)) as [number, number, number];

    return {
      rgb: mixedRgb,
      recipe: colorsToMix,
      hint: `Mezcla: ${colorsToMix.map(c => c.emoji).join(' + ')}`
    };
  };

  useEffect(() => {
    setTargetColor(generateTargetColor());
  }, [level]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('gameover');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  const mixColors = (colors: Color[]): [number, number, number] => {
    if (colors.length === 0) return [200, 200, 200];
    
    const mixed = colors.reduce((acc, color) => {
      return [
        acc[0] + color.rgb[0],
        acc[1] + color.rgb[1],
        acc[2] + color.rgb[2]
      ] as [number, number, number];
    }, [0, 0, 0] as [number, number, number]).map(v => Math.floor(v / colors.length)) as [number, number, number];
    
    return mixed;
  };

  const calculateColorDifference = (rgb1: [number, number, number], rgb2: [number, number, number]): number => {
    const diff = Math.sqrt(
      Math.pow(rgb1[0] - rgb2[0], 2) +
      Math.pow(rgb1[1] - rgb2[1], 2) +
      Math.pow(rgb1[2] - rgb2[2], 2)
    );
    
    const maxDiff = Math.sqrt(255 * 255 * 3);
    return 100 - (diff / maxDiff) * 100;
  };

  const handleColorClick = (color: Color): void => {
    if (gameState !== 'playing' || !targetColor) return;

    const newSelected = [...selectedColors, color];
    setSelectedColors(newSelected);

    if (newSelected.length === targetColor.recipe.length) {
      setTimeout(() => checkMix(newSelected), 300);
    }
  };

  const checkMix = (colors: Color[] = selectedColors): void => {
    if (!targetColor) return;

    const playerMix = mixColors(colors);
    const accuracy = calculateColorDifference(playerMix, targetColor.rgb);

    if (accuracy >= 80) {
      const points = Math.floor(accuracy * level);
      setScore(score + points);
      setFeedback(`¡Perfecto! +${points} puntos`);
      setGameState('success');
      
      setTimeout(() => {
        setLevel(level + 1);
        setTargetColor(generateTargetColor());
        setSelectedColors([]);
        setGameState('playing');
        setTimeLeft(Math.max(15, 30 - level));
        setFeedback('');
      }, 2000);
    } else if (accuracy >= 50) {
      setFeedback(`Casi... ${accuracy.toFixed(0)}% de precisión. ¡Intenta otra combinación!`);
      setTimeout(() => {
        setSelectedColors([]);
        setFeedback('');
      }, 1500);
    } else {
      setFeedback('Muy lejos... Intenta de nuevo');
      setTimeout(() => {
        setSelectedColors([]);
        setFeedback('');
      }, 1500);
    }
  };

  const removeLastColor = (): void => {
    setSelectedColors(selectedColors.slice(0, -1));
  };

  const reset = (): void => {
    setScore(0);
    setLevel(1);
    setTimeLeft(30);
    setSelectedColors([]);
    setTargetColor(generateTargetColor());
    setGameState('playing');
    setFeedback('');
  };

  const playerColor = mixColors(selectedColors);
  const rgbToString = (rgb: [number, number, number]): string => `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Botón para volver */}
        <div className="mb-4">
          <Link href="/">
            <button className="bg-white/10 text-white px-4 py-2 rounded-lg font-bold hover:bg-white/20 transition-all flex items-center gap-2">
              <Home className="w-5 h-5" />
              ← Volver al Menú
            </button>
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 text-yellow-300" />
              Alquimia de Colores
            </h1>
            <p className="text-purple-200">¡Mezcla los colores correctos para crear el color objetivo!</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/20 rounded-xl p-4 text-center">
              <Trophy className="w-6 h-6 text-yellow-300 mx-auto mb-1" />
              <div className="text-2xl font-bold text-white">{score}</div>
              <div className="text-xs text-purple-200">Puntos</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4 text-center">
              <Sparkles className="w-6 h-6 text-blue-300 mx-auto mb-1" />
              <div className="text-2xl font-bold text-white">{level}</div>
              <div className="text-xs text-purple-200">Nivel</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4 text-center">
              <Clock className="w-6 h-6 text-red-300 mx-auto mb-1" />
              <div className="text-2xl font-bold text-white">{timeLeft}s</div>
              <div className="text-xs text-purple-200">Tiempo</div>
            </div>
          </div>

          {gameState === 'playing' && targetColor && (
            <>
              {/* Target Color */}
              <div className="mb-6">
                <h2 className="text-white font-bold mb-3 text-center">🎯 Color Objetivo</h2>
                <div 
                  className="h-32 rounded-2xl shadow-2xl border-4 border-white/30 mx-auto max-w-md"
                  style={{ backgroundColor: rgbToString(targetColor.rgb) }}
                />
                <p className="text-center text-purple-200 mt-2 text-sm">{targetColor.hint}</p>
              </div>

              {/* Player Mix */}
              <div className="mb-6">
                <h2 className="text-white font-bold mb-3 text-center">🧪 Tu Mezcla</h2>
                <div 
                  className="h-24 rounded-2xl shadow-xl border-4 border-white/30 mx-auto max-w-md transition-all duration-300"
                  style={{ backgroundColor: rgbToString(playerColor) }}
                />
                <div className="text-center mt-2">
                  {selectedColors.length > 0 ? (
                    <div className="flex justify-center gap-2 items-center">
                      <span className="text-white text-sm">
                        {selectedColors.map(c => c.emoji).join(' + ')}
                      </span>
                      <button
                        onClick={removeLastColor}
                        className="text-xs bg-red-500/50 text-white px-3 py-1 rounded-full hover:bg-red-500/70"
                      >
                        Borrar último
                      </button>
                    </div>
                  ) : (
                    <span className="text-purple-300 text-sm">Selecciona colores abajo</span>
                  )}
                </div>
              </div>

              {/* Feedback */}
              {feedback && (
                <div className="mb-4 text-center">
                  <div className="bg-white/20 rounded-xl p-3 inline-block">
                    <p className="text-white font-bold">{feedback}</p>
                  </div>
                </div>
              )}

              {/* Color Palette */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {baseColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleColorClick(color)}
                    disabled={selectedColors.length >= targetColor.recipe.length}
                    className="aspect-square rounded-2xl shadow-xl border-4 border-white/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-2 font-bold text-white text-lg"
                    style={{ backgroundColor: rgbToString(color.rgb) }}
                  >
                    <span className="text-4xl">{color.emoji}</span>
                    <span className="text-sm">{color.name}</span>
                  </button>
                ))}
              </div>

              {/* Instructions */}
              <div className="bg-purple-900/50 rounded-xl p-4 border border-purple-400/30">
                <h3 className="text-purple-200 font-bold mb-2 text-sm">💡 Cómo jugar:</h3>
                <ul className="text-purple-200 text-xs space-y-1">
                  <li>1. Mira el color objetivo arriba</li>
                  <li>2. Haz clic en los colores para mezclarlos</li>
                  <li>3. Sigue la pista de emojis para saber qué mezclar</li>
                  <li>4. ¡Necesitas 80%+ de precisión para avanzar!</li>
                </ul>
              </div>
            </>
          )}

          {gameState === 'gameover' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⏰</div>
              <h2 className="text-3xl font-bold text-white mb-4">¡Tiempo Agotado!</h2>
              <p className="text-purple-200 mb-2">Puntuación final: {score}</p>
              <p className="text-purple-300 mb-6">Llegaste al nivel {level}</p>
              <button
                onClick={reset}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-xl"
              >
                Jugar de Nuevo
              </button>
            </div>
          )}

          {/* Reset Button */}
          {gameState === 'playing' && (
            <button
              onClick={reset}
              className="w-full mt-4 bg-white/10 text-white py-3 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reiniciar Juego
            </button>
          )}
        </div>
      </div>
    </div>
  );
}