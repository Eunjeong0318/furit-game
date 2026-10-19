import React from 'react';
import { Trophy, RotateCcw, Sparkles } from 'lucide-react';
import { FruitTier } from '../types/game';
import { FRUITS } from '../utils/fruits';

interface GameOverModalProps {
  score: number;
  highScore: number;
  highestTier: FruitTier;
  watermelons: number;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  highestTier,
  watermelons,
  onRestart,
}) => {
  const isNewHighScore = score >= highScore && score > 0;
  const highestFruit = FRUITS[highestTier];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-4 border-amber-800 text-center relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-100 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-rose-100 rounded-full blur-xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-400 flex items-center justify-center text-3xl shadow-md border-2 border-white">
            {highestTier === 10 ? '🍉' : '🧺'}
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {isNewHighScore ? '최고 기록 달성! 🎉' : '게임 오버'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            과일이 상자 위로 넘쳤습니다!
          </p>
        </div>

        {/* Score & Highlights Box */}
        <div className="my-5 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex flex-col gap-3">
          <div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              최종 점수
            </span>
            <div className="text-4xl font-black text-amber-950 font-mono tabular-nums mt-0.5">
              {score.toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-amber-200/60">
            <div className="p-2 rounded-xl bg-white/80 border border-amber-100 text-left">
              <span className="text-[10px] font-semibold text-slate-500 block">최고 점수</span>
              <span className="text-sm font-bold text-slate-800 font-mono tabular-nums">
                {highScore.toLocaleString()}점
              </span>
            </div>

            <div className="p-2 rounded-xl bg-white/80 border border-amber-100 text-left">
              <span className="text-[10px] font-semibold text-slate-500 block">최고 과일</span>
              <span className="text-sm font-bold text-emerald-700 truncate block">
                {highestFruit.name} ({highestFruit.score}점)
              </span>
            </div>
          </div>

          {watermelons > 0 && (
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>수박 {watermelons}개 완성 성공!</span>
            </div>
          )}
        </div>

        {/* Primary Restart Action Button */}
        <button
          onClick={onRestart}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-600 hover:from-emerald-400 hover:to-green-500 text-white font-extrabold text-base shadow-lg shadow-emerald-600/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>다시 도전하기</span>
        </button>
      </div>
    </div>
  );
};
