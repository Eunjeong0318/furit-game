import React from 'react';
import { FRUITS } from '../utils/fruits';
import { FruitTier } from '../types/game';

interface EvolutionGuideProps {
  highestTier: FruitTier;
}

export const EvolutionGuide: React.FC<EvolutionGuideProps> = ({ highestTier }) => {
  return (
    <div className="w-full max-w-md mx-auto mt-3 px-2">
      <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-2xl border border-amber-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
            <span>과일 진화 순서</span>
            <span className="text-[10px] font-normal text-amber-700/80">(작은 과일 → 수박)</span>
          </span>
          <span className="text-[10px] text-amber-800 font-medium">
            도달: <strong className="text-emerald-700">{FRUITS[highestTier].name}</strong>
          </span>
        </div>

        {/* Fruit Evolution Track */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto py-1 px-0.5 scrollbar-none">
          {FRUITS.map((fruit, idx) => {
            const isUnlocked = fruit.tier <= highestTier;
            return (
              <React.Fragment key={fruit.tier}>
                <div
                  className={`flex flex-col items-center shrink-0 transition-transform ${
                    isUnlocked ? 'opacity-100 scale-100' : 'opacity-40 scale-90'
                  }`}
                  title={`${fruit.name} (+${fruit.score}점)`}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-xs border transition-all"
                    style={{
                      backgroundColor: fruit.color,
                      borderColor: isUnlocked ? fruit.borderColor : '#CBD5E1',
                      boxShadow: fruit.tier === highestTier ? '0 0 0 2px #F59E0B' : undefined,
                    }}
                  >
                    <span className="text-[11px] drop-shadow-xs">
                      {getFruitEmoji(fruit.tier)}
                    </span>
                  </div>
                  <span className="text-[9px] font-semibold text-slate-700 mt-0.5 whitespace-nowrap">
                    {fruit.name}
                  </span>
                </div>

                {idx < FRUITS.length - 1 && (
                  <span className="text-[10px] text-amber-400 font-bold shrink-0">
                    ›
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function getFruitEmoji(tier: FruitTier): string {
  switch (tier) {
    case 0: return '🍒';
    case 1: return '🍓';
    case 2: return '🍇';
    case 3: return '🍊';
    case 4: return '🌰';
    case 5: return '🍎';
    case 6: return '🍐';
    case 7: return '🍑';
    case 8: return '🍍';
    case 9: return '🍈';
    case 10: return '🍉';
    default: return '🍒';
  }
}
