import React, { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';
import confetti from 'canvas-confetti';
import { FruitTier, Particle, ScorePopup } from '../types/game';
import { FRUITS, getRandomDropTier, drawFruit } from '../utils/fruits';
import { soundFx } from '../utils/audio';

interface GameBoardProps {
  onScoreUpdate: (points: number, newTier: FruitTier) => void;
  onGameOver: (finalScore: number) => void;
  onWatermelonCreated: () => void;
  isPaused: boolean;
  jiggleTrigger: number;
  onDropReadyChange?: (ready: boolean) => void;
  nextTier: FruitTier;
  onConsumeNext: () => FruitTier;
}

const BOARD_WIDTH = 400;
const BOARD_HEIGHT = 620;
const DANGER_LINE_Y = 120;
const DROPPER_Y = 58;
const DROP_COOLDOWN_MS = 550;
const DANGER_LIMIT_SECONDS = 2.5;

interface FruitBodyData {
  tier: FruitTier;
  isMerged: boolean;
  scaleX: number;
  scaleY: number;
  squishTime: number;
  createdAt: number;
  hasLanded: boolean;
  inDanger: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  onScoreUpdate,
  onGameOver,
  onWatermelonCreated,
  isPaused,
  jiggleTrigger,
  nextTier,
  onConsumeNext,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Matter engine references
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const fruitBodiesRef = useRef<Matter.Body[]>([]);

  // Dropper states
  const [currentTier, setCurrentTier] = useState<FruitTier>(0);
  const [dropperX, setDropperX] = useState<number>(BOARD_WIDTH / 2);
  const [canDrop, setCanDrop] = useState<boolean>(true);
  const [isAiming, setIsAiming] = useState<boolean>(false);
  const [shakeOffset, setShakeOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Refs for tracking in loop without re-renders
  const canDropRef = useRef(canDrop);
  canDropRef.current = canDrop;
  const currentTierRef = useRef(currentTier);
  currentTierRef.current = currentTier;
  const dropperXRef = useRef(dropperX);
  dropperXRef.current = dropperX;
  const isGameOverRef = useRef(false);

  // Particles & Popups
  const particlesRef = useRef<Particle[]>([]);
  const popupsRef = useRef<ScorePopup[]>([]);

  // Combo state
  const lastMergeTimeRef = useRef<number>(0);
  const comboCountRef = useRef<number>(0);

  // Danger timer
  const dangerStartTimeRef = useRef<number | null>(null);
  const [dangerProgress, setDangerProgress] = useState<number>(0);
  const lastWarningSoundRef = useRef<number>(0);

  // Initialize first fruit
  useEffect(() => {
    setCurrentTier(getRandomDropTier());
  }, []);

  // Drop Fruit Execution
  const dropFruit = useCallback(() => {
    if (!canDropRef.current || isGameOverRef.current || isPaused || !engineRef.current) {
      return;
    }

    const tier = currentTierRef.current;
    const fruitDef = FRUITS[tier];
    const x = Math.max(fruitDef.radius + 14, Math.min(BOARD_WIDTH - fruitDef.radius - 14, dropperXRef.current));
    const y = DROPPER_Y;

    // Create Matter circle body
    const body = Matter.Bodies.circle(x, y, fruitDef.radius, {
      restitution: 0.22,
      friction: 0.15,
      frictionAir: 0.008,
      density: 0.002,
      label: 'fruit',
      collisionFilter: {
        category: 0x0001,
        mask: 0x0001,
      },
    });

    const customData: FruitBodyData = {
      tier,
      isMerged: false,
      scaleX: 1,
      scaleY: 1,
      squishTime: 0,
      createdAt: Date.now(),
      hasLanded: false,
      inDanger: false,
    };
    (body as unknown as { customData: FruitBodyData }).customData = customData;

    Matter.Composite.add(engineRef.current.world, body);
    fruitBodiesRef.current.push(body);

    soundFx.playDropSound();

    // Trigger drop cooldown
    setCanDrop(false);
    canDropRef.current = false;

    // Load next fruit
    setTimeout(() => {
      if (!isGameOverRef.current) {
        const next = onConsumeNext();
        setCurrentTier(next);
        setCanDrop(true);
        canDropRef.current = true;
      }
    }, DROP_COOLDOWN_MS);
  }, [isPaused, onConsumeNext]);

  // Jiggle Effect (Shakes container and gives gentle random impulse to bodies)
  useEffect(() => {
    if (jiggleTrigger === 0 || !engineRef.current || isGameOverRef.current) return;

    soundFx.playJiggleSound();

    // Shake visual canvas
    let frames = 0;
    const shakeInterval = setInterval(() => {
      frames++;
      if (frames > 8) {
        clearInterval(shakeInterval);
        setShakeOffset({ x: 0, y: 0 });
      } else {
        setShakeOffset({
          x: (Math.random() - 0.5) * 8,
          y: (Math.random() - 0.5) * 8,
        });
      }
    }, 25);

    // Physics impulse to fruits
    fruitBodiesRef.current.forEach((body) => {
      const impulseX = (Math.random() - 0.5) * 0.015 * body.mass;
      const impulseY = -0.02 * body.mass;
      Matter.Body.applyForce(body, body.position, { x: impulseX, y: impulseY });
    });
  }, [jiggleTrigger]);

  // Setup Matter.js World and Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI Support
    const dpr = window.devicePixelRatio || 1;
    canvas.width = BOARD_WIDTH * dpr;
    canvas.height = BOARD_HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    // Create Matter Engine
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1.15, scale: 0.001 },
    });
    engineRef.current = engine;

    // Static Boundaries (Left wall, Right wall, Bottom floor)
    const wallOptions: Matter.IChamferableBodyDefinition = {
      isStatic: true,
      friction: 0.2,
      restitution: 0.2,
      collisionFilter: { category: 0x0001 },
    };

    const leftWall = Matter.Bodies.rectangle(-10, BOARD_HEIGHT / 2, 20, BOARD_HEIGHT * 2, wallOptions);
    const rightWall = Matter.Bodies.rectangle(BOARD_WIDTH + 10, BOARD_HEIGHT / 2, 20, BOARD_HEIGHT * 2, wallOptions);
    const floor = Matter.Bodies.rectangle(BOARD_WIDTH / 2, BOARD_HEIGHT + 10, BOARD_WIDTH * 2, 20, wallOptions);

    Matter.Composite.add(engine.world, [leftWall, rightWall, floor]);

    // Collision Event Handling
    Matter.Events.on(engine, 'collisionStart', (event) => {
      const now = Date.now();
      const pairs = event.pairs;

      for (let i = 0; i < pairs.length; i++) {
        const { bodyA, bodyB } = pairs[i];

        // Track when fruit touches floor or other fruit (landed)
        if (bodyA.label === 'fruit') {
          const dataA = (bodyA as unknown as { customData?: FruitBodyData }).customData;
          if (dataA && !dataA.hasLanded) {
            dataA.hasLanded = true;
            soundFx.playBounceSound(bodyA.speed);
          }
        }
        if (bodyB.label === 'fruit') {
          const dataB = (bodyB as unknown as { customData?: FruitBodyData }).customData;
          if (dataB && !dataB.hasLanded) {
            dataB.hasLanded = true;
            soundFx.playBounceSound(bodyB.speed);
          }
        }

        // Fruit-to-fruit merge logic
        if (bodyA.label === 'fruit' && bodyB.label === 'fruit') {
          const dataA = (bodyA as unknown as { customData: FruitBodyData }).customData;
          const dataB = (bodyB as unknown as { customData: FruitBodyData }).customData;

          if (
            dataA &&
            dataB &&
            dataA.tier === dataB.tier &&
            !dataA.isMerged &&
            !dataB.isMerged
          ) {
            // Prevent double merge
            dataA.isMerged = true;
            dataB.isMerged = true;

            const currentTier = dataA.tier;
            const midX = (bodyA.position.x + bodyB.position.x) / 2;
            const midY = (bodyA.position.y + bodyB.position.y) / 2;

            // Remove bodies safely
            Matter.Composite.remove(engine.world, [bodyA, bodyB]);
            fruitBodiesRef.current = fruitBodiesRef.current.filter(
              (b) => b !== bodyA && b !== bodyB
            );

            // Combo multiplier calculation
            if (now - lastMergeTimeRef.current < 1600) {
              comboCountRef.current += 1;
            } else {
              comboCountRef.current = 1;
            }
            lastMergeTimeRef.current = now;
            const combo = comboCountRef.current;

            const nextTierIndex = (currentTier + 1) as FruitTier;
            const basePoints = FRUITS[currentTier].score * 2;
            const pointsAwarded = basePoints * combo;

            // Emit score
            onScoreUpdate(pointsAwarded, nextTierIndex);

            // Particle burst at merge location
            const fruitColor = FRUITS[currentTier].color;
            const accentColor = FRUITS[currentTier].accentColor;
            for (let p = 0; p < 16; p++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = 1.5 + Math.random() * 4.5;
              particlesRef.current.push({
                x: midX,
                y: midY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.2,
                color: Math.random() > 0.4 ? fruitColor : accentColor,
                size: 3 + Math.random() * 4,
                alpha: 1,
                life: 0,
                maxLife: 35 + Math.random() * 20,
              });
            }

            // Score popup text
            popupsRef.current.push({
              id: `${now}-${Math.random()}`,
              x: midX,
              y: midY,
              score: pointsAwarded,
              combo: combo > 1 ? combo : undefined,
              opacity: 1,
              createdAt: now,
            });

            // Audio FX
            soundFx.playMergeSound(nextTierIndex);
            if (combo > 1) {
              soundFx.playComboSound(combo);
            }

            // Watermelon check
            if (nextTierIndex === 10) {
              onWatermelonCreated();
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#22C55E', '#15803D', '#F43F5E', '#FEF08A'],
              });
            }

            // Create merged new fruit (if not exceeding max, or easter egg merge)
            if (currentTier < 10) {
              const newDef = FRUITS[nextTierIndex];
              const newBody = Matter.Bodies.circle(midX, midY, newDef.radius, {
                restitution: 0.22,
                friction: 0.15,
                frictionAir: 0.008,
                density: 0.002,
                label: 'fruit',
                collisionFilter: { category: 0x0001 },
              });

              const newData: FruitBodyData = {
                tier: nextTierIndex,
                isMerged: false,
                scaleX: 1.28,
                scaleY: 0.72,
                squishTime: 16,
                createdAt: now,
                hasLanded: true,
                inDanger: false,
              };
              (newBody as unknown as { customData: FruitBodyData }).customData = newData;

              // Gentle upward impulse upon popping into existence
              Matter.Body.setVelocity(newBody, {
                x: (bodyA.velocity.x + bodyB.velocity.x) * 0.2,
                y: -2.2,
              });

              Matter.Composite.add(engine.world, newBody);
              fruitBodiesRef.current.push(newBody);
            } else if (currentTier === 10) {
              // Double Watermelon Easter Egg!
              confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.5 },
                colors: ['#FFD700', '#FF4500', '#32CD32'],
              });
              onScoreUpdate(1000, 10);
            }
          }
        }
      }
    });

    // Main Game Loop using requestAnimationFrame
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = Math.min(currentTime - lastTime, 32);
      lastTime = currentTime;

      if (!isPaused && !isGameOverRef.current) {
        Matter.Engine.update(engine, delta);
      }

      // Clear Canvas
      ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

      // 1. Draw subtle wooden game container background
      drawContainerBackground(ctx);

      // 2. Draw Danger Line (at y = DANGER_LINE_Y)
      const now = Date.now();
      let dangerFruitPresent = false;

      // Update and check fruit bodies for danger state
      fruitBodiesRef.current.forEach((body) => {
        const data = (body as unknown as { customData: FruitBodyData }).customData;
        if (!data) return;

        // Animate squish back to 1
        if (data.squishTime > 0) {
          data.squishTime--;
          const progress = data.squishTime / 16;
          data.scaleX = 1 + 0.28 * progress;
          data.scaleY = 1 - 0.28 * progress;
        } else {
          data.scaleX = 1;
          data.scaleY = 1;
        }

        const fruitDef = FRUITS[data.tier];
        const topY = body.position.y - fruitDef.radius;

        // A fruit triggers danger if top is above deadline AND it has settled/landed
        if (topY < DANGER_LINE_Y && data.hasLanded && Math.abs(body.velocity.y) < 1.2) {
          data.inDanger = true;
          dangerFruitPresent = true;
        } else {
          data.inDanger = false;
        }
      });

      // Handle Danger Countdown & Game Over
      if (dangerFruitPresent && !isGameOverRef.current) {
        if (!dangerStartTimeRef.current) {
          dangerStartTimeRef.current = now;
        }
        const elapsed = (now - dangerStartTimeRef.current) / 1000;
        const progress = Math.min(elapsed / DANGER_LIMIT_SECONDS, 1);
        setDangerProgress(progress);

        // Warning sound beep
        if (now - lastWarningSoundRef.current > 550) {
          soundFx.playWarningBeep();
          lastWarningSoundRef.current = now;
        }

        if (elapsed >= DANGER_LIMIT_SECONDS) {
          isGameOverRef.current = true;
          soundFx.playGameOverSound();
          onGameOver(0);
        }
      } else {
        dangerStartTimeRef.current = null;
        setDangerProgress(0);
      }

      // Draw Danger Guideline with pulsating warning when endangered
      drawDangerLine(ctx, dangerFruitPresent, dangerProgress);

      // 3. Draw All Settled Fruit Bodies
      fruitBodiesRef.current.forEach((body) => {
        const data = (body as unknown as { customData: FruitBodyData }).customData;
        if (!data) return;
        const fruitDef = FRUITS[data.tier];

        drawFruit(
          ctx,
          body.position.x,
          body.position.y,
          fruitDef.radius,
          data.tier,
          body.angle,
          data.scaleX,
          data.scaleY,
          data.inDanger
        );
      });

      // 4. Draw Dropper Guide Line & Current Fruit (if can drop and game active)
      if (canDropRef.current && !isGameOverRef.current && !isPaused) {
        const activeTier = currentTierRef.current;
        const curFruit = FRUITS[activeTier];
        const clampedX = Math.max(
          curFruit.radius + 14,
          Math.min(BOARD_WIDTH - curFruit.radius - 14, dropperXRef.current)
        );

        // Dashed trajectory projection line
        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = 'rgba(234, 88, 12, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(clampedX, DROPPER_Y + curFruit.radius + 2);
        ctx.lineTo(clampedX, BOARD_HEIGHT - 10);
        ctx.stroke();
        ctx.restore();

        // Little dropper claw / cloud indicator
        drawDropperIndicator(ctx, clampedX, DROPPER_Y - curFruit.radius - 6);

        // Active fruit preview floating smoothly
        drawFruit(ctx, clampedX, DROPPER_Y, curFruit.radius, activeTier, 0, 1, 1, false);
      }

      // 5. Update and Draw Particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // Gravity
        p.life++;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return p.life < p.maxLife;
      });

      // 6. Update and Draw Score Popups
      popupsRef.current = popupsRef.current.filter((popup) => {
        const age = (now - popup.createdAt) / 1000;
        popup.y -= 0.8; // Float up
        popup.opacity = Math.max(0, 1 - age / 0.85);

        ctx.save();
        ctx.globalAlpha = popup.opacity;
        ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#EA580C';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;

        const text = popup.combo ? `+${popup.score} COMBO x${popup.combo}!` : `+${popup.score}`;
        ctx.strokeText(text, popup.x, popup.y);
        ctx.fillText(text, popup.x, popup.y);
        ctx.restore();

        return age < 0.85;
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
      Matter.Engine.clear(engine);
    };
  }, [isPaused, onScoreUpdate, onGameOver, onWatermelonCreated]);

  // Pointer Movement & Drag Handler
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || isPaused || isGameOverRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = BOARD_WIDTH / rect.width;
    const clientX = e.clientX - rect.left;
    const canvasX = clientX * scale;

    const curFruit = FRUITS[currentTierRef.current];
    const clampedX = Math.max(
      curFruit.radius + 14,
      Math.min(BOARD_WIDTH - curFruit.radius - 14, canvasX)
    );
    setDropperX(clampedX);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsAiming(true);
    handlePointerMove(e);
  };

  const handlePointerUp = () => {
    if (isAiming) {
      setIsAiming(false);
      dropFruit();
    }
  };

  // Keyboard controls (Left/Right/Space/Down)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused || isGameOverRef.current) return;

      const curFruit = FRUITS[currentTierRef.current];
      const step = 20;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setDropperX((prev) =>
          Math.max(curFruit.radius + 14, prev - step)
        );
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setDropperX((prev) =>
          Math.min(BOARD_WIDTH - curFruit.radius - 14, prev + step)
        );
      } else if (e.key === ' ' || e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        dropFruit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, dropFruit]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center select-none touch-none"
      style={{
        transform: `translate(${shakeOffset.x}px, ${shakeOffset.y}px)`,
        transition: 'transform 0.05s ease',
      }}
    >
      {/* Wooden container outer frame with smooth tactile aesthetic */}
      <div className="relative rounded-2xl p-2.5 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 shadow-2xl border-4 border-amber-900/80">
        {/* Subtle woodgrain bezel shine */}
        <div className="absolute inset-x-3 top-1 h-1 bg-amber-400/25 rounded-full blur-[1px]" />

        {/* The Game Canvas */}
        <canvas
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => setIsAiming(false)}
          className="rounded-xl cursor-ew-resize bg-[#FFFBF0] shadow-inner block"
          style={{
            width: '100%',
            maxWidth: '380px',
            aspectRatio: '400 / 620',
          }}
        />

        {/* Next Fruit Floating Quick Indicator (Top Right Corner inside Frame) */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-amber-200/80 shadow-md flex items-center gap-2 pointer-events-none">
          <span className="text-[11px] font-bold text-amber-900 tracking-tight">NEXT</span>
          <div className="w-6 h-6 flex items-center justify-center">
            <div
              className="rounded-full shadow-xs flex items-center justify-center text-xs"
              style={{
                width: `${Math.min(FRUITS[nextTier].radius * 0.9, 24)}px`,
                height: `${Math.min(FRUITS[nextTier].radius * 0.9, 24)}px`,
                backgroundColor: FRUITS[nextTier].color,
              }}
            />
          </div>
        </div>

        {/* Danger countdown badge banner if in danger */}
        {dangerProgress > 0 && (
          <div className="absolute top-28 inset-x-8 bg-rose-600/90 text-white text-xs font-bold py-1 px-3 rounded-lg text-center shadow-lg animate-pulse backdrop-blur-xs flex items-center justify-center gap-1.5">
            <span>⚠️ 넘치기 직전!</span>
            <span className="font-mono tabular-nums">
              {(DANGER_LIMIT_SECONDS * (1 - dangerProgress)).toFixed(1)}초
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Background pattern for the fruit container
 */
function drawContainerBackground(ctx: CanvasRenderingContext2D) {
  // Soft ambient gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, BOARD_HEIGHT);
  bgGrad.addColorStop(0, '#FFFDF8');
  bgGrad.addColorStop(0.3, '#FFF9EB');
  bgGrad.addColorStop(1, '#FEF3C7');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

  // Subtle interior grid / wood lines
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.05)';
  ctx.lineWidth = 1;
  for (let y = 60; y < BOARD_HEIGHT; y += 40) {
    ctx.beginPath();
    ctx.moveTo(8, y);
    ctx.lineTo(BOARD_WIDTH - 8, y);
    ctx.stroke();
  }

  // Side inner shadow edges
  const leftShadow = ctx.createLinearGradient(0, 0, 16, 0);
  leftShadow.addColorStop(0, 'rgba(180, 83, 9, 0.08)');
  leftShadow.addColorStop(1, 'transparent');
  ctx.fillStyle = leftShadow;
  ctx.fillRect(0, 0, 16, BOARD_HEIGHT);

  const rightShadow = ctx.createLinearGradient(BOARD_WIDTH, 0, BOARD_WIDTH - 16, 0);
  rightShadow.addColorStop(0, 'rgba(180, 83, 9, 0.08)');
  rightShadow.addColorStop(1, 'transparent');
  ctx.fillStyle = rightShadow;
  ctx.fillRect(BOARD_WIDTH - 16, 0, 16, BOARD_HEIGHT);
}

/**
 * Draw Danger Line (Deadline)
 */
function drawDangerLine(
  ctx: CanvasRenderingContext2D,
  inDanger: boolean,
  progress: number
) {
  ctx.save();

  if (inDanger) {
    // Pulsing bright red warning line
    const pulse = (Math.sin(Date.now() * 0.015) + 1) * 0.5;
    ctx.strokeStyle = `rgba(239, 68, 68, ${0.7 + pulse * 0.3})`;
    ctx.lineWidth = 2.5 + pulse;
    ctx.setLineDash([8, 4]);

    // Red warning backdrop glow
    ctx.fillStyle = `rgba(239, 68, 68, ${0.06 + progress * 0.08})`;
    ctx.fillRect(0, 0, BOARD_WIDTH, DANGER_LINE_Y);
  } else {
    // Subtle dashed indicator
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
  }

  ctx.beginPath();
  ctx.moveTo(12, DANGER_LINE_Y);
  ctx.lineTo(BOARD_WIDTH - 12, DANGER_LINE_Y);
  ctx.stroke();

  // Deadline marker text on left
  ctx.setLineDash([]);
  ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = inDanger ? '#DC2626' : 'rgba(244, 63, 94, 0.6)';
  ctx.textAlign = 'left';
  ctx.fillText('DEADLINE', 14, DANGER_LINE_Y - 4);

  ctx.restore();
}

/**
 * Cute Cloud/Claw Dropper Indicator at the top
 */
function drawDropperIndicator(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  // Downward pointing arrow triangle
  ctx.moveTo(x, y + 4);
  ctx.lineTo(x - 6, y - 5);
  ctx.lineTo(x + 6, y - 5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
