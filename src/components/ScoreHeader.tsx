import React from 'react';
import { Volume2, VolumeX, RotateCcw, HelpCircle, Sparkles, Trophy } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface ScoreHeaderProps {
  score: number;
  highScore: number;
  watermelons: number;
  jigglesRemaining: number;
  onJiggle: () => void;
  onRestart: () => void;
  onOpenHelp: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const ScoreHeader: React.FC<ScoreHeaderProps> = ({
  score,
  highScore,
  watermelons,
  jigglesRemaining,
  onJiggle,
  onRestart,
  onOpenHelp,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="w-full max-w-md mx-auto mb-3 px-2">
      {/* Top action row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center text-lg shadow-sm border border-emerald-700/20">
            🍉
          </div>
          <div className="leading-tight">
            <h1 className="font-extrabold text-base tracking-tight text-amber-950 font-['Plus_Jakarta_Sans']">
              수박게임
            </h1>
            <p className="text-[11px] font-medium text-amber-800/80">
              과일을 합쳐 수박을 완성하세요
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleMute}
            className="w-8 h-8 rounded-lg bg-white/80 hover:bg-white border border-amber-200 text-amber-900 flex items-center justify-center transition-colors shadow-xs active:scale-95"
            title={isMuted ? '소리 켜기' : '소리 끄기'}
            aria-label="Sound Toggle"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-amber-800" />}
          </button>

          <button
            onClick={onOpenHelp}
            className="w-8 h-8 rounded-lg bg-white/80 hover:bg-white border border-amber-200 text-amber-900 flex items-center justify-center transition-colors shadow-xs active:scale-95"
            title="게임 방법"
            aria-label="Help"
          >
            <HelpCircle className="w-4 h-4 text-amber-800" />
          </button>

          <button
            onClick={onRestart}
            className="w-8 h-8 rounded-lg bg-white/80 hover:bg-white border border-amber-200 text-amber-900 flex items-center justify-center transition-colors shadow-xs active:scale-95"
            title="새로 시작"
            aria-label="Restart Game"
          >
            <RotateCcw className="w-4 h-4 text-amber-800" />
          </button>
        </div>
      </div>

      {/* Main Score & Control Strip */}
      <div className="grid grid-cols-3 gap-2 bg-white/90 backdrop-blur-xs p-2.5 rounded-2xl border border-amber-200/90 shadow-sm">
        {/* Current Score */}
        <div className="flex flex-col justify-center px-2 py-1 rounded-xl bg-amber-50/70 border border-amber-100">
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
            SCORE
          </span>
          <span className="text-xl font-extrabold text-amber-950 font-mono tabular-nums leading-none mt-0.5">
            {score.toLocaleString()}
          </span>
        </div>

        {/* High Score & Watermelon count */}
        <div className="flex flex-col justify-center px-2 py-1 rounded-xl bg-amber-50/70 border border-amber-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-600" /> BEST
            </span>
            {watermelons > 0 && (
              <span className="text-[10px] font-bold text-emerald-700">
                🍉 {watermelons}
              </span>
            )}
          </div>
          <span className="text-xl font-extrabold text-amber-900 font-mono tabular-nums leading-none mt-0.5">
            {highScore.toLocaleString()}
          </span>
        </div>

        {/* Jiggle (Shake) Interactive Button */}
        <button
          onClick={() => {
            if (jigglesRemaining > 0) {
              onJiggle();
            }
          }}
          disabled={jigglesRemaining <= 0}
          className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl border font-medium transition-all shadow-xs ${
            jigglesRemaining > 0
              ? 'bg-gradient-to-b from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white border-orange-700 active:scale-95'
              : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
          }`}
        >
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-bold whitespace-nowrap">흔들기</span>
          </div>
          <span className="text-[10px] font-mono opacity-90 mt-0.5">
            {jigglesRemaining}/2 회
          </span>
        </button>
      </div>
    </div>
  );
};
