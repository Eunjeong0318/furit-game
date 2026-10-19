import { FruitDef, FruitTier } from '../types/game';

export const FRUITS: FruitDef[] = [
  {
    tier: 0,
    name: '체리',
    nameEn: 'Cherry',
    radius: 17,
    score: 1,
    color: '#E11D48',
    accentColor: '#BE123C',
    borderColor: '#9F1239',
    dropWeight: 40,
  },
  {
    tier: 1,
    name: '딸기',
    nameEn: 'Strawberry',
    radius: 23,
    score: 3,
    color: '#F43F5E',
    accentColor: '#E11D48',
    borderColor: '#BE123C',
    dropWeight: 30,
  },
  {
    tier: 2,
    name: '포도',
    nameEn: 'Grape',
    radius: 31,
    score: 6,
    color: '#9333EA',
    accentColor: '#7E22CE',
    borderColor: '#6B21A8',
    dropWeight: 18,
  },
  {
    tier: 3,
    name: '한라봉',
    nameEn: 'Dekopon',
    radius: 40,
    score: 10,
    color: '#F97316',
    accentColor: '#EA580C',
    borderColor: '#C2410C',
    dropWeight: 9,
  },
  {
    tier: 4,
    name: '감',
    nameEn: 'Persimmon',
    radius: 50,
    score: 15,
    color: '#FB923C',
    accentColor: '#F97316',
    borderColor: '#C2410C',
    dropWeight: 3,
  },
  {
    tier: 5,
    name: '사과',
    nameEn: 'Apple',
    radius: 62,
    score: 21,
    color: '#EF4444',
    accentColor: '#DC2626',
    borderColor: '#B91C1C',
    dropWeight: 0,
  },
  {
    tier: 6,
    name: '배',
    nameEn: 'Pear',
    radius: 76,
    score: 28,
    color: '#FACC15',
    accentColor: '#EAB308',
    borderColor: '#CA8A04',
    dropWeight: 0,
  },
  {
    tier: 7,
    name: '복숭아',
    nameEn: 'Peach',
    radius: 90,
    score: 36,
    color: '#FDA4AF',
    accentColor: '#FB7185',
    borderColor: '#F43F5E',
    dropWeight: 0,
  },
  {
    tier: 8,
    name: '파인애플',
    nameEn: 'Pineapple',
    radius: 105,
    score: 45,
    color: '#F59E0B',
    accentColor: '#D97706',
    borderColor: '#B45309',
    dropWeight: 0,
  },
  {
    tier: 9,
    name: '멜론',
    nameEn: 'Melon',
    radius: 122,
    score: 55,
    color: '#86EFAC',
    accentColor: '#4ADE80',
    borderColor: '#22C55E',
    dropWeight: 0,
  },
  {
    tier: 10,
    name: '수박',
    nameEn: 'Watermelon',
    radius: 140,
    score: 66,
    color: '#22C55E',
    accentColor: '#15803D',
    borderColor: '#166534',
    dropWeight: 0,
  },
];

/**
 * Returns a random fruit tier appropriate for dropping (Tier 0 to 4)
 */
export function getRandomDropTier(): FruitTier {
  const droppable = FRUITS.filter((f) => f.dropWeight > 0);
  const totalWeight = droppable.reduce((acc, f) => acc + f.dropWeight, 0);
  let rand = Math.random() * totalWeight;

  for (const fruit of droppable) {
    if (rand < fruit.dropWeight) {
      return fruit.tier;
    }
    rand -= fruit.dropWeight;
  }
  return 0;
}

/**
 * Draw fruit with high-fidelity vector styling, cute face, and bounce effect
 */
export function drawFruit(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  tier: FruitTier,
  angle = 0,
  scaleX = 1,
  scaleY = 1,
  inDanger = false
) {
  const fruit = FRUITS[tier] || FRUITS[0];

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(scaleX, scaleY);

  // Subtle outer soft shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
  ctx.shadowBlur = Math.min(radius * 0.25, 12);
  ctx.shadowOffsetY = Math.min(radius * 0.12, 6);

  // Body gradient
  const grad = ctx.createRadialGradient(
    -radius * 0.3,
    -radius * 0.3,
    radius * 0.1,
    0,
    0,
    radius
  );

  switch (tier) {
    case 0: // Cherry
      grad.addColorStop(0, '#FB7185');
      grad.addColorStop(0.7, '#E11D48');
      grad.addColorStop(1, '#9F1239');
      break;
    case 1: // Strawberry
      grad.addColorStop(0, '#FDA4AF');
      grad.addColorStop(0.6, '#F43F5E');
      grad.addColorStop(1, '#BE123C');
      break;
    case 2: // Grape
      grad.addColorStop(0, '#C084FC');
      grad.addColorStop(0.6, '#9333EA');
      grad.addColorStop(1, '#581C87');
      break;
    case 3: // Dekopon
      grad.addColorStop(0, '#FDBA74');
      grad.addColorStop(0.7, '#F97316');
      grad.addColorStop(1, '#C2410C');
      break;
    case 4: // Persimmon
      grad.addColorStop(0, '#FED7AA');
      grad.addColorStop(0.6, '#FB923C');
      grad.addColorStop(1, '#9A3412');
      break;
    case 5: // Apple
      grad.addColorStop(0, '#FCA5A5');
      grad.addColorStop(0.65, '#EF4444');
      grad.addColorStop(1, '#991B1B');
      break;
    case 6: // Pear
      grad.addColorStop(0, '#FEF08A');
      grad.addColorStop(0.7, '#FACC15');
      grad.addColorStop(1, '#A16207');
      break;
    case 7: // Peach
      grad.addColorStop(0, '#FFF1F2');
      grad.addColorStop(0.4, '#FECDD3');
      grad.addColorStop(0.85, '#FB7185');
      grad.addColorStop(1, '#E11D48');
      break;
    case 8: // Pineapple
      grad.addColorStop(0, '#FDE68A');
      grad.addColorStop(0.6, '#F59E0B');
      grad.addColorStop(1, '#B45309');
      break;
    case 9: // Melon
      grad.addColorStop(0, '#BBF7D0');
      grad.addColorStop(0.65, '#4ADE80');
      grad.addColorStop(1, '#15803D');
      break;
    case 10: // Watermelon
      grad.addColorStop(0, '#4ADE80');
      grad.addColorStop(0.6, '#22C55E');
      grad.addColorStop(1, '#14532D');
      break;
  }

  // Draw main circle body
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Reset shadow for inner details
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Thin outer border
  ctx.strokeStyle = fruit.borderColor;
  ctx.lineWidth = Math.max(radius * 0.04, 1.5);
  ctx.stroke();

  // Tier-specific surface decorations
  drawFruitDetails(ctx, tier, radius);

  // Glossy highlight shine
  ctx.beginPath();
  ctx.ellipse(
    -radius * 0.35,
    -radius * 0.35,
    radius * 0.28,
    radius * 0.16,
    -Math.PI / 4,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fill();

  // Kawaii Face Expressions
  drawFruitFace(ctx, radius, tier, inDanger);

  ctx.restore();
}

/**
 * Fruit-specific detailed patterns (watermelon stripes, melon netting, strawberry seeds, pineapple lattice, etc.)
 */
function drawFruitDetails(
  ctx: CanvasRenderingContext2D,
  tier: FruitTier,
  radius: number
) {
  switch (tier) {
    case 0: {
      // Cherry: brown curved stem and tiny green leaf
      ctx.beginPath();
      ctx.moveTo(0, -radius * 0.7);
      ctx.quadraticCurveTo(radius * 0.3, -radius * 1.3, radius * 0.1, -radius * 1.5);
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = Math.max(radius * 0.12, 2);
      ctx.lineCap = 'round';
      ctx.stroke();

      // Leaf
      ctx.beginPath();
      ctx.ellipse(radius * 0.3, -radius * 1.25, radius * 0.3, radius * 0.15, 0.4, 0, Math.PI * 2);
      ctx.fillStyle = '#22C55E';
      ctx.fill();
      break;
    }
    case 1: {
      // Strawberry: green calyx top + little seeds
      ctx.fillStyle = '#16A34A';
      ctx.beginPath();
      ctx.moveTo(-radius * 0.5, -radius * 0.75);
      ctx.lineTo(-radius * 0.2, -radius * 0.95);
      ctx.lineTo(0, -radius * 0.7);
      ctx.lineTo(radius * 0.2, -radius * 0.95);
      ctx.lineTo(radius * 0.5, -radius * 0.75);
      ctx.lineTo(0, -radius * 0.6);
      ctx.closePath();
      ctx.fill();

      // Seeds
      ctx.fillStyle = '#FEF08A';
      const seedOffsets = [
        [-radius * 0.5, -radius * 0.2],
        [-radius * 0.2, -radius * 0.35],
        [radius * 0.2, -radius * 0.35],
        [radius * 0.5, -radius * 0.2],
        [-radius * 0.35, radius * 0.4],
        [radius * 0.35, radius * 0.4],
        [0, radius * 0.55],
      ];
      seedOffsets.forEach(([sx, sy]) => {
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(radius * 0.045, 1.2), 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }
    case 2: {
      // Grape: green curly vine + mini leaf
      ctx.beginPath();
      ctx.ellipse(0, -radius * 0.85, radius * 0.25, radius * 0.14, -0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#16A34A';
      ctx.fill();
      break;
    }
    case 3: {
      // Dekopon (한라봉): Top prominent knob bump
      ctx.beginPath();
      ctx.arc(0, -radius * 0.88, radius * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = '#EA580C';
      ctx.fill();

      // Small green leaf
      ctx.beginPath();
      ctx.ellipse(radius * 0.15, -radius * 1.05, radius * 0.18, radius * 0.1, 0.5, 0, Math.PI * 2);
      ctx.fillStyle = '#22C55E';
      ctx.fill();
      break;
    }
    case 4: {
      // Persimmon (감): 4-star calyx cap
      ctx.fillStyle = '#15803D';
      const starSize = radius * 0.35;
      for (let i = 0; i < 4; i++) {
        const ang = (i * Math.PI) / 2;
        ctx.beginPath();
        ctx.ellipse(
          Math.cos(ang) * starSize * 0.7,
          -radius * 0.8 + Math.sin(ang) * starSize * 0.3,
          starSize * 0.45,
          starSize * 0.25,
          ang,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      break;
    }
    case 5: {
      // Apple: Top indent + brown twig + vibrant green leaf
      ctx.beginPath();
      ctx.moveTo(0, -radius * 0.75);
      ctx.lineTo(radius * 0.1, -radius * 1.15);
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = Math.max(radius * 0.08, 2.5);
      ctx.lineCap = 'round';
      ctx.stroke();

      // Leaf
      ctx.beginPath();
      ctx.ellipse(radius * 0.3, -radius * 1.05, radius * 0.35, radius * 0.18, 0.4, 0, Math.PI * 2);
      ctx.fillStyle = '#22C55E';
      ctx.fill();
      break;
    }
    case 6: {
      // Pear: Freckle dots
      ctx.fillStyle = 'rgba(161, 98, 7, 0.35)';
      const dots = [
        [-radius * 0.5, radius * 0.2],
        [-radius * 0.3, radius * 0.5],
        [radius * 0.45, radius * 0.35],
        [radius * 0.2, radius * 0.6],
        [-radius * 0.6, -radius * 0.2],
        [radius * 0.5, -radius * 0.25],
      ];
      dots.forEach(([dx, dy]) => {
        ctx.beginPath();
        ctx.arc(dx, dy, Math.max(radius * 0.035, 1.5), 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }
    case 7: {
      // Peach: Top cleft crease
      ctx.beginPath();
      ctx.moveTo(0, -radius * 0.95);
      ctx.quadraticCurveTo(radius * 0.08, -radius * 0.3, 0, radius * 0.1);
      ctx.strokeStyle = 'rgba(225, 29, 72, 0.35)';
      ctx.lineWidth = Math.max(radius * 0.04, 2);
      ctx.stroke();
      break;
    }
    case 8: {
      // Pineapple: Diamond criss-cross lattice and crown
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, radius - 2, 0, Math.PI * 2);
      ctx.clip();

      ctx.strokeStyle = 'rgba(180, 83, 9, 0.4)';
      ctx.lineWidth = Math.max(radius * 0.035, 1.5);
      const step = radius * 0.4;
      for (let i = -radius * 2; i <= radius * 2; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, -radius * 1.2);
        ctx.lineTo(i + radius * 2, radius * 1.2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(i, radius * 1.2);
        ctx.lineTo(i + radius * 2, -radius * 1.2);
        ctx.stroke();
      }
      ctx.restore();

      // Pineapple spiky crown at top
      ctx.fillStyle = '#16A34A';
      const crown = [
        [-radius * 0.35, -radius * 0.8, -radius * 0.45, -radius * 1.25],
        [-radius * 0.12, -radius * 0.85, 0, -radius * 1.4],
        [radius * 0.12, -radius * 0.85, radius * 0.45, -radius * 1.25],
      ];
      crown.forEach(([bx, by, tx, ty]) => {
        ctx.beginPath();
        ctx.moveTo(bx - radius * 0.1, by);
        ctx.lineTo(tx, ty);
        ctx.lineTo(bx + radius * 0.1, by);
        ctx.closePath();
        ctx.fill();
      });
      break;
    }
    case 9: {
      // Melon: White netting mesh
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, radius - 2, 0, Math.PI * 2);
      ctx.clip();

      ctx.strokeStyle = 'rgba(240, 253, 244, 0.75)';
      ctx.lineWidth = Math.max(radius * 0.03, 1.5);
      const mStep = radius * 0.38;
      for (let i = -radius * 1.8; i <= radius * 1.8; i += mStep) {
        ctx.beginPath();
        ctx.arc(i, 0, radius * 0.9, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // T-shaped stem
      ctx.beginPath();
      ctx.moveTo(0, -radius * 0.88);
      ctx.lineTo(0, -radius * 1.15);
      ctx.moveTo(-radius * 0.18, -radius * 1.15);
      ctx.lineTo(radius * 0.18, -radius * 1.15);
      ctx.strokeStyle = '#A16207';
      ctx.lineWidth = Math.max(radius * 0.06, 2.5);
      ctx.lineCap = 'round';
      ctx.stroke();
      break;
    }
    case 10: {
      // Watermelon: Distinctive dark green wavy/zigzag stripes!
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, radius - 2, 0, Math.PI * 2);
      ctx.clip();

      ctx.strokeStyle = '#052E16';
      ctx.lineWidth = Math.max(radius * 0.14, 8);
      ctx.lineCap = 'round';

      const stripeAngles = [-0.65, -0.35, 0, 0.35, 0.65];
      stripeAngles.forEach((ang) => {
        const cx = Math.sin(ang) * radius * 0.9;
        ctx.beginPath();
        ctx.moveTo(cx * 0.8, -radius);
        ctx.quadraticCurveTo(cx * 1.25, 0, cx * 0.8, radius);
        ctx.stroke();
      });

      ctx.restore();

      // Crown on top of the ultimate watermelon!
      ctx.fillStyle = '#F59E0B';
      const cW = radius * 0.45;
      const cH = radius * 0.35;
      const cY = -radius * 0.9;
      ctx.beginPath();
      ctx.moveTo(-cW * 0.5, cY);
      ctx.lineTo(-cW * 0.5, cY - cH * 0.8);
      ctx.lineTo(-cW * 0.25, cY - cH * 0.35);
      ctx.lineTo(0, cY - cH);
      ctx.lineTo(cW * 0.25, cY - cH * 0.35);
      ctx.lineTo(cW * 0.5, cY - cH * 0.8);
      ctx.lineTo(cW * 0.5, cY);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      break;
    }
  }
}

/**
 * Adorable Kawaii Facial Expressions
 */
function drawFruitFace(
  ctx: CanvasRenderingContext2D,
  radius: number,
  tier: FruitTier,
  inDanger: boolean
) {
  // Face position: slightly below center
  const eyeY = radius * 0.05;
  const eyeSpacing = radius * 0.28;
  const eyeSize = Math.max(radius * 0.075, 2.2);

  if (inDanger) {
    // Worried / Surprised face when touching danger deadline!
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = Math.max(radius * 0.05, 1.5);
    ctx.lineCap = 'round';

    // Worried curved eyes > < or circles
    ctx.beginPath();
    ctx.arc(-eyeSpacing, eyeY, eyeSize * 1.1, 0, Math.PI * 2);
    ctx.arc(eyeSpacing, eyeY, eyeSize * 1.1, 0, Math.PI * 2);
    ctx.fillStyle = '#0F172A';
    ctx.fill();

    // Open round "O" mouth
    ctx.beginPath();
    ctx.arc(0, eyeY + radius * 0.25, eyeSize * 1.3, 0, Math.PI * 2);
    ctx.fillStyle = '#0F172A';
    ctx.fill();

    // Sweat drop
    ctx.beginPath();
    ctx.arc(radius * 0.5, -radius * 0.2, eyeSize * 0.9, 0, Math.PI * 2);
    ctx.fillStyle = '#38BDF8';
    ctx.fill();
    return;
  }

  // Normal cute eyes with catchlights
  ctx.fillStyle = '#0F172A';
  if (tier === 5) {
    // Apple: Winking eye on right!
    ctx.beginPath();
    ctx.arc(-eyeSpacing, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(eyeSpacing, eyeY, eyeSize * 1.1, 0.1, Math.PI - 0.1);
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = Math.max(radius * 0.05, 1.8);
    ctx.stroke();
  } else {
    // Standard cute round eyes
    ctx.beginPath();
    ctx.arc(-eyeSpacing, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.arc(eyeSpacing, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();

    // White eye catchlights
    ctx.fillStyle = '#FFFFFF';
    const catchSize = eyeSize * 0.4;
    ctx.beginPath();
    ctx.arc(-eyeSpacing - catchSize * 0.5, eyeY - catchSize * 0.5, catchSize, 0, Math.PI * 2);
    ctx.arc(eyeSpacing - catchSize * 0.5, eyeY - catchSize * 0.5, catchSize, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pink Blush Cheeks
  ctx.fillStyle = 'rgba(244, 63, 94, 0.45)';
  const blushY = eyeY + radius * 0.12;
  const blushRadius = Math.max(radius * 0.1, 2.5);
  ctx.beginPath();
  ctx.arc(-eyeSpacing * 1.25, blushY, blushRadius, 0, Math.PI * 2);
  ctx.arc(eyeSpacing * 1.25, blushY, blushRadius, 0, Math.PI * 2);
  ctx.fill();

  // Cute Smile Mouth
  const mouthY = eyeY + radius * 0.18;
  const mouthWidth = radius * 0.14;

  if (tier >= 9) {
    // Wide joyful open smile for Melon and Watermelon!
    ctx.beginPath();
    ctx.arc(0, mouthY, mouthWidth * 1.2, 0, Math.PI);
    ctx.fillStyle = '#0F172A';
    ctx.fill();

    // Cute pink tongue
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, mouthY, mouthWidth * 1.2, 0, Math.PI);
    ctx.clip();
    ctx.beginPath();
    ctx.arc(0, mouthY + mouthWidth * 0.8, mouthWidth * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = '#F43F5E';
    ctx.fill();
    ctx.restore();
  } else {
    // Gentle smiling arc
    ctx.beginPath();
    ctx.arc(0, mouthY - radius * 0.02, mouthWidth, 0.15, Math.PI - 0.15);
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = Math.max(radius * 0.045, 1.4);
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}
