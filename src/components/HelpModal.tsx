import React from 'react';
import { X, Lightbulb, MousePointer, Keyboard } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-2 border-amber-200 relative text-left max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="닫기"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🍉</span>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              게임 방법
            </h3>
            <p className="text-xs text-slate-500">규칙과 조작법을 확인해보세요</p>
          </div>
        </div>

        {/* Rules */}
        <div className="space-y-3 text-xs text-slate-700">
          <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[10px]">
                1
              </span>
              <p className="leading-relaxed">
                <strong>같은 과일 2개</strong>가 부딪치면 더 큰 다음 단계 과일로 합쳐집니다!
              </p>
            </div>

            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[10px]">
                2
              </span>
              <p className="leading-relaxed">
                가장 작은 <strong>체리(🍒)</strong>부터 시작해 최종 <strong>수박(🍉)</strong>을 만드는 것이 목표입니다.
              </p>
            </div>

            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[10px]">
                3
              </span>
              <p className="leading-relaxed">
                과일이 상단 <strong>빨간 점선(DEADLINE)</strong> 위로 2.5초 이상 머무르면 게임이 끝납니다.
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <MousePointer className="w-3.5 h-3.5 text-amber-600" />
              조작 방법
            </span>
            <div className="space-y-1 text-slate-600">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">마우스/터치:</span>
                <span>좌우로 밀어서 조준하고, 손을 떼면 낙하</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">키보드:</span>
                <span>←/→ 이동, 스페이스바/↓키 낙하</span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1.5">
            <span className="font-bold text-emerald-950 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
              플레이 꿀팁
            </span>
            <p className="text-emerald-800 leading-relaxed">
              • 과일이 좁은 틈에 끼였을 때는 상단의 <strong>흔들기</strong> 버튼을 누르면 통을 살짝 흔들어 정돈할 수 있습니다!
              <br />
              • 연속으로 과일을 합치면 <strong>콤보(COMBO) 보너스 점수</strong>가 주어집니다!
            </p>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-md active:scale-98 transition-all cursor-pointer"
        >
          확인했습니다
        </button>
      </div>
    </div>
  );
};
