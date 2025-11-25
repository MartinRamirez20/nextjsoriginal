'use client';

import Link from 'next/link';
import { Gamepad2, Sparkles, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 flex items-center justify-center gap-4">
            <Gamepad2 className="w-16 h-16 text-purple-400" />
            Arcade de Juegos
          </h1>
          <p className="text-purple-200 text-xl">Selecciona tu juego favorito</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Juego 1 - Alquimia de Colores */}
          <Link href="/pestana1">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer shadow-2xl hover:shadow-purple-500/50 border-4 border-white/20">
              <div className="text-center">
                <Sparkles className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-3">
                  Alquimia de Colores
                </h2>
                <p className="text-purple-100 text-sm mb-4">
                  Mezcla colores para crear el tono perfecto
                </p>
                <div className="bg-white/20 rounded-lg px-4 py-2 inline-block">
                  <span className="text-white font-bold">Jugar →</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Juego 2 */}
          <Link href="/pestana2">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer shadow-2xl hover:shadow-blue-500/50 border-4 border-white/20">
              <div className="text-center">
                <Zap className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-3">
                  Triqui
                </h2>
                <p className="text-blue-100 text-sm mb-4">
                  Triqui Traca Telas
                </p>
                <div className="bg-white/20 rounded-lg px-4 py-2 inline-block">
                  <span className="text-white font-bold">Jugar →</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Juego 3 */}
          <Link href="/pestana3">
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer shadow-2xl hover:shadow-green-500/50 border-4 border-white/20">
              <div className="text-center">
                <Gamepad2 className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-3">
                  Conecta 4
                </h2>
                <p className="text-green-100 text-sm mb-4">
                  Conecta una linea de 4 bolas diagonal, vertical, horizontal, hexagonal.
                </p>
                <div className="bg-white/20 rounded-lg px-4 py-2 inline-block">
                  <span className="text-white font-bold">Jugar →</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-12">
          <p className="text-purple-300 text-sm">
            Hecho con ❤️ | Presiona cualquier tarjeta para jugar
          </p>
        </div>
      </div>
    </div>
  );
}