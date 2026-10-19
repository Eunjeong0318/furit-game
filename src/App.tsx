/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { GameBoard } from './components/GameBoard';
import { ScoreHeader } from './components/ScoreHeader';
import { EvolutionGuide } from './components/EvolutionGuide';
import { GameOverModal } from './components/GameOverModal';
import { HelpModal } from './components/HelpModal';
import { FruitTier } from './types/game';
import { getRandomDropTier } from './utils/fruits';
import { soundFx } from './utils/audio';

export default function App() {
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('suika_high_score');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [highestTier, setHighestTier] = useState<FruitTier>(0);
  const [watermelons, setWatermelons] = useState<number>(0);
  const [jigglesRemaining, setJigglesRemaining] = useState<number>(2);
  const [jiggleTrigger, setJiggleTrigger] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => soundFx.isMuted());
  const [gameKey, setGameKey] = useState<number>(1);

  // Next Fruit queue
  const [nextTier, setNextTier] = useState<FruitTier>(getRandomDropTier());

  // Handle Score Updates
  const handleScoreUpdate = useCallback((points: number, newTier: FruitTier) => {
    setScore((prevScore) => {
      const nextScore = prevScore + points;
      setHighScore((prevHigh) => {
        if (nextScore > prevHigh) {
          localStorage.setItem('suika_high_score', String(nextScore));
          return nextScore;
        }
        return prevHigh;
      });
      return nextScore;
    });

    setHighestTier((prevTier) => Math.max(prevTier, newTier) as FruitTier);
  }, []);

  // Next Fruit Consume Handler
  const handleConsumeNext = useCallback((): FruitTier => {
    const consumed = nextTier;
    setNextTier(getRandomDropTier());
    return consumed;
  }, [nextTier]);

  // Handle Watermelon Creation
  const handleWatermelonCreated = useCallback(() => {
    setWatermelons((prev) => prev + 1);
  }, []);

  // Handle Game Over
  const handleGameOver = useCallback(() => {
    setIsGameOver(true);
  }, []);

  // Handle Restart
  const handleRestart = useCallback(() => {
    setScore(0);
    setHighestTier(0);
    setWatermelons(0);
    setJigglesRemaining(2);
    setJiggleTrigger(0);
    setIsGameOver(false);
    setNextTier(getRandomDropTier());
    setGameKey((k) => k + 1);
  }, []);

  // Handle Jiggle
  const handleJiggle = useCallback(() => {
    if (jigglesRemaining > 0 && !isGameOver) {
      setJigglesRemaining((prev) => prev - 1);
      setJiggleTrigger((k) => k + 1);
    }
  }, [jigglesRemaining, isGameOver]);

  // Handle Toggle Mute
  const handleToggleMute = useCallback(() => {
    const nextMuted = soundFx.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  return (
    <main className="min-h-screen bg-radial from-amber-50 via-amber-100/60 to-amber-200/50 py-4 px-2 flex flex-col items-center justify-between font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background soft ambient elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute -top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-rose-200 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-amber-200 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md flex flex-col items-center relative z-10">
        {/* Game Header with Score & Controls */}
        <ScoreHeader
          score={score}
          highScore={highScore}
          watermelons={watermelons}
          jigglesRemaining={jigglesRemaining}
          onJiggle={handleJiggle}
          onRestart={handleRestart}
          onOpenHelp={() => setShowHelp(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />

        {/* Physics Game Board */}
        <GameBoard
          key={gameKey}
          onScoreUpdate={handleScoreUpdate}
          onGameOver={handleGameOver}
          onWatermelonCreated={handleWatermelonCreated}
          isPaused={isGameOver}
          jiggleTrigger={jiggleTrigger}
          nextTier={nextTier}
          onConsumeNext={handleConsumeNext}
        />

        {/* Evolution Fruit Progress Guide */}
        <EvolutionGuide highestTier={highestTier} />
      </div>

      {/* Footer copyright & simple tip */}
      <footer className="mt-4 text-center text-xs text-amber-800/70 relative z-10">
        <span>팁: 과일을 드래그하여 조준하고 놓으면 떨어집니다! (스페이스바로 낙하 가능)</span>
      </footer>

      {/* Game Over Dialog */}
      {isGameOver && (
        <GameOverModal
          score={score}
          highScore={highScore}
          highestTier={highestTier}
          watermelons={watermelons}
          onRestart={handleRestart}
        />
      )}

      {/* Help & Rules Dialog */}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </main>
  );
}
