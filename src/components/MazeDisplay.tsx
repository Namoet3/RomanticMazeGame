
import React from 'react';
import { CellType, PlayerState, LostWhisperState, ChestState, Position, Sparkle, LoveBoomerangState, ConfettiParticle, SootheAnimationState, PlayerDirection, DreamEssenceItem } from '../../types';
import { PortalKeyOnMap } from '../hooks/useGameController';
import { TILE_SIZE, ZOMBIE_VISUAL_MOVE_DURATION, CONFETTI_LIFESPAN, SOOTHE_ANIMATION_DURATION, JUMP_SCARE_DURATION_MS } from '../../constants';
import { PlayerIcon, LostWhisperIcon, GiftBoxIcon, NextDreamPortalIcon, KeyIcon, HeartIcon, SparkleIcon, ConfettiPieceIcon, BoomerangHitAnimationIcon, AimingArrowIcon, DreamEssenceIcon } from '../../components/icons';
import { canSee } from '../utils/los';

interface JumpScareEffectType {
  whisperId: string;
  position: Position;
  key: number;
}
interface MazeDisplayProps {
  mazeGrid: CellType[][];
  playerState: PlayerState;
  lostWhispers: LostWhisperState[];
  giftBoxes: ChestState[];
  portalKeyOnMap: PortalKeyOnMap | null;
  heartCluePath: Position[] | null;
  currentLevel: number;
  isLastStandAnimating: boolean;
  sparkles: Sparkle[];
  animatingGiftBoxPosition: Position | null;
  loveBoomerang: LoveBoomerangState | null;
  sootheAnimations: SootheAnimationState[];
  confettiParticles: ConfettiParticle[];
  dreamEssenceItems: DreamEssenceItem[]; 
  jumpScareEffect: JumpScareEffectType | null; 
  realityGlitchTriggerKey: number | null; // Added prop
}

const getRotationAngle = (direction: PlayerDirection): number => {
    switch (direction) {
        case 'up': return 0; 
        case 'down': return 180;
        case 'left': return -90;
        case 'right': return 90;
        default: return 0;
    }
};

const MazeDisplay: React.FC<MazeDisplayProps> = ({
  mazeGrid, playerState, lostWhispers, giftBoxes, portalKeyOnMap,
  heartCluePath, currentLevel, isLastStandAnimating, sparkles,
  animatingGiftBoxPosition, loveBoomerang, sootheAnimations, confettiParticles,
  dreamEssenceItems, 
  jumpScareEffect,
  realityGlitchTriggerKey, // Destructured prop
}) => {
  if (!mazeGrid.length || !mazeGrid[0]) return <div className="text-center text-sm text-pink-300">Dreaming up the maze...</div>;

  const viewportWidthTiles = Math.floor((window.innerWidth * 0.9) / TILE_SIZE);
  const viewportHeightTiles = Math.floor((window.innerHeight * 0.7) / TILE_SIZE);

  let startX = Math.max(0, playerState.position.x - Math.floor(viewportWidthTiles / 2));
  let startY = Math.max(0, playerState.position.y - Math.floor(viewportHeightTiles / 2));
  let endX = Math.min(mazeGrid[0].length, startX + viewportWidthTiles);
  let endY = Math.min(mazeGrid.length, startY + viewportHeightTiles);

  if (endX === mazeGrid[0].length) startX = Math.max(0, endX - viewportWidthTiles);
  if (endY === mazeGrid.length) startY = Math.max(0, endY - viewportHeightTiles);

  endX = Math.min(mazeGrid[0].length, startX + viewportWidthTiles);
  endY = Math.min(mazeGrid.length, startY + viewportHeightTiles);

  const visibleGrid = mazeGrid.slice(startY, endY).map(row => row.slice(startX, endX));
  const displayMazeWidth = (endX - startX) * TILE_SIZE;
  const displayMazeHeight = (endY - startY) * TILE_SIZE;

  const playerIconClasses = ["absolute text-pink-400"]; 
  if (playerState.hearts === 1 && !isLastStandAnimating) playerIconClasses.push("animate-heartbeat-pulse");
  if (playerState.isCouplePowerActive) playerIconClasses.push("animate-couple-power");

  const pIconStyleLeft = (playerState.position.x - startX) * TILE_SIZE + TILE_SIZE * 0.1;
  const pIconStyleTop = (playerState.position.y - startY) * TILE_SIZE + TILE_SIZE * 0.1;
  const pIconWidth = TILE_SIZE * 0.8;
  const pIconHeight = TILE_SIZE * 0.8;

  const pIconCenterX = pIconStyleLeft + pIconWidth / 2;
  const pIconCenterY = pIconStyleTop + pIconHeight / 2;

  const arrowSize = TILE_SIZE * 0.35; 
  const gap = TILE_SIZE * 0.02; 

  let arrowEffectiveLeft = 0;
  let arrowEffectiveTop = 0;

  switch (playerState.playerLastMoveDirection) {
    case 'up':
      arrowEffectiveLeft = pIconCenterX - arrowSize / 2;
      arrowEffectiveTop = pIconStyleTop - arrowSize - gap;
      break;
    case 'down':
      arrowEffectiveLeft = pIconCenterX - arrowSize / 2;
      arrowEffectiveTop = pIconStyleTop + pIconHeight + gap;
      break;
    case 'left':
      arrowEffectiveLeft = pIconStyleLeft - arrowSize - gap;
      arrowEffectiveTop = pIconCenterY - arrowSize / 2;
      break;
    case 'right':
      arrowEffectiveLeft = pIconStyleLeft + pIconWidth + gap;
      arrowEffectiveTop = pIconCenterY - arrowSize / 2;
      break;
    default: 
      arrowEffectiveLeft = (playerState.position.x - startX) * TILE_SIZE + TILE_SIZE * 0.25;
      arrowEffectiveTop = (playerState.position.y - startY) * TILE_SIZE + TILE_SIZE * 0.25;
  }


  return (
    <div className="relative border border-purple-700 shadow-lg rounded-md overflow-hidden" style={{ width: displayMazeWidth, height: displayMazeHeight, backgroundColor: '#1e162b' }}>
      {visibleGrid.map((row, yIdx) =>
        row.map((cell, xIdx) => {
          const actualY = startY + yIdx;
          const actualX = startX + xIdx;
          
          const isTileVisibleByLOS = canSee(playerState.position, { x: actualX, y: actualY }, mazeGrid);
          let tileOpacity = 0;

          if (isTileVisibleByLOS) {
            const distanceToPlayer = Math.sqrt(Math.pow(playerState.position.x - actualX, 2) + Math.pow(playerState.position.y - actualY, 2));
            const flashlightRadius = playerState.flashlightRadius;
            const penumbraWidth = 1.5;
            const isFullyVisibleByFlashlight = distanceToPlayer <= flashlightRadius - 0.5;
            const isInPenumbraByFlashlight = distanceToPlayer > flashlightRadius - 0.5 && distanceToPlayer <= flashlightRadius + penumbraWidth;

            if (isFullyVisibleByFlashlight) {
              tileOpacity = 1;
            } else if (isInPenumbraByFlashlight) {
              const penumbraFactor = (flashlightRadius + penumbraWidth - distanceToPlayer) / (penumbraWidth + 0.5);
              tileOpacity = 0.05 + 0.95 * penumbraFactor;
              tileOpacity = Math.max(0.03, Math.min(1, tileOpacity * tileOpacity));
            }
            if (cell === CellType.WALL) {
              tileOpacity = Math.max(tileOpacity, 0.02);
            }
          }

          let bgColor = 'bg-purple-900'; 
          if (cell === CellType.WALL) bgColor = 'bg-indigo-900';
          else if (cell === CellType.DOOR) bgColor = 'bg-pink-700';
          
          return (
            <div key={`tile-${actualY}-${actualX}`}
              className={`absolute flex items-center justify-center ${bgColor} transition-opacity duration-300 ease-out`}
              style={{ width: TILE_SIZE, height: TILE_SIZE, left: xIdx * TILE_SIZE, top: yIdx * TILE_SIZE, opacity: tileOpacity }}>
              {cell === CellType.DOOR && tileOpacity > 0 && <NextDreamPortalIcon className={`w-3/4 h-3/4 ${playerState.hasPortalKey ? 'text-pink-300 animate-pulse' : 'text-gray-500'}`} style={{ opacity: tileOpacity > 0.5 ? 1 : 0.4 }} title={playerState.hasPortalKey ? "Portal Unlocked!" : "Portal Locked"} />}
            </div>
          );
        })
      )}

      {sparkles.map(sparkle => {
         if (sparkle.position.x < startX || sparkle.position.x >= endX || sparkle.position.y < startY || sparkle.position.y >= endY) return null;
         if (canSee(playerState.position, sparkle.position, mazeGrid)) {
            const distanceToPlayer = Math.sqrt(Math.pow(playerState.position.x - sparkle.position.x, 2) + Math.pow(playerState.position.y - sparkle.position.y, 2));
            if (distanceToPlayer <= playerState.flashlightRadius + 1.0) {
                return <SparkleIcon key={sparkle.id} className="absolute text-yellow-200 animate-sparkle-fade" style={{ width: TILE_SIZE * 0.2, height: TILE_SIZE * 0.2, left: (sparkle.position.x - startX + 0.4) * TILE_SIZE, top: (sparkle.position.y - startY + 0.4) * TILE_SIZE, opacity: 0, '--sparkle-lifespan': `${(sparkle.createdAt + 700 - Date.now()) / 1000}s` } as React.CSSProperties} />;
            }
         } return null;
      })}

      {portalKeyOnMap?.isVisible && portalKeyOnMap.position.x >= startX && portalKeyOnMap.position.x < endX && portalKeyOnMap.position.y >= startY && portalKeyOnMap.position.y < endY && canSee(playerState.position, portalKeyOnMap.position, mazeGrid) && (() => {
          const distanceToPlayer = Math.sqrt(Math.pow(playerState.position.x - portalKeyOnMap.position.x, 2) + Math.pow(playerState.position.y - portalKeyOnMap.position.y, 2));
          if (distanceToPlayer <= playerState.flashlightRadius + 0.3) return <KeyIcon className="absolute text-yellow-300 animate-pulse" style={{ width: TILE_SIZE * 0.7, height: TILE_SIZE * 0.7, left: (portalKeyOnMap.position.x - startX) * TILE_SIZE + TILE_SIZE * 0.15, top: (portalKeyOnMap.position.y - startY) * TILE_SIZE + TILE_SIZE * 0.15, opacity: Math.min(1, (playerState.flashlightRadius + 0.3 - distanceToPlayer) + 0.2) }} title="Portal Key!" />;
          return null;
      })()}

      {heartCluePath?.map((pos, idx) => {
        if (pos.x < startX || pos.x >= endX || pos.y < startY || pos.y >= endY) return null;
        if (canSee(playerState.position, pos, mazeGrid) && Math.sqrt(Math.pow(playerState.position.x - pos.x, 2) + Math.pow(playerState.position.y - pos.y, 2)) <= playerState.flashlightRadius + 1.5) {
          return <HeartIcon key={`clue-${idx}`} className="absolute text-pink-400 animate-follow-heart-clue" style={{ width: TILE_SIZE * 0.55, height: TILE_SIZE * 0.55, left: (pos.x - startX) * TILE_SIZE + TILE_SIZE * 0.225, top: (pos.y - startY) * TILE_SIZE + TILE_SIZE * 0.225, animationDelay: `${idx * 150}ms`, opacity: 0 }} />;
        } return null;
      })}

      {giftBoxes.map(gb => {
        if (gb.position.x < startX || gb.position.x >= endX || gb.position.y < startY || gb.position.y >= endY) return null;
        if (!gb.isOpen && canSee(playerState.position, gb.position, mazeGrid) && Math.sqrt(Math.pow(playerState.position.x - gb.position.x, 2) + Math.pow(playerState.position.y - gb.position.y, 2)) <= playerState.flashlightRadius + 0.3) {
          const isAnimating = animatingGiftBoxPosition?.x === gb.position.x && animatingGiftBoxPosition?.y === gb.position.y;
          return <GiftBoxIcon key={gb.id} className={`absolute transform transition-opacity duration-300 text-yellow-400 ${isAnimating ? 'animate-giftbox-open' : ''}`} style={{ width: TILE_SIZE * 0.8, height: TILE_SIZE * 0.8, left: (gb.position.x - startX) * TILE_SIZE + TILE_SIZE * 0.1, top: (gb.position.y - startY) * TILE_SIZE + TILE_SIZE * 0.1, opacity: Math.min(1, (playerState.flashlightRadius + 0.3 - Math.sqrt(Math.pow(playerState.position.x - gb.position.x, 2) + Math.pow(playerState.position.y - gb.position.y, 2))) + 0.2) }} title="A sweet secret?" />;
        } return null;
      })}
      
      {dreamEssenceItems.map(de => {
        if (de.position.x < startX || de.position.x >= endX || de.position.y < startY || de.position.y >= endY) return null;
        if (canSee(playerState.position, de.position, mazeGrid) && Math.sqrt(Math.pow(playerState.position.x - de.position.x, 2) + Math.pow(playerState.position.y - de.position.y, 2)) <= playerState.flashlightRadius + 0.5) {
          return <DreamEssenceIcon key={de.id} className="absolute text-purple-400 animate-pulse" style={{ width: TILE_SIZE * 0.6, height: TILE_SIZE * 0.6, left: (de.position.x - startX) * TILE_SIZE + TILE_SIZE * 0.2, top: (de.position.y - startY) * TILE_SIZE + TILE_SIZE * 0.2, opacity: Math.min(0.8, (playerState.flashlightRadius + 0.5 - Math.sqrt(Math.pow(playerState.position.x - de.position.x, 2) + Math.pow(playerState.position.y - de.position.y, 2))) + 0.3) }} title="Dream Essence" />;
        } return null;
      })}

      {loveBoomerang?.isActive && loveBoomerang.position.x >= startX * TILE_SIZE - TILE_SIZE && loveBoomerang.position.x < endX * TILE_SIZE + TILE_SIZE && loveBoomerang.position.y >= startY * TILE_SIZE - TILE_SIZE && loveBoomerang.position.y < endY * TILE_SIZE + TILE_SIZE && (
        <HeartIcon
            className="absolute text-pink-500 animate-pulse"
            style={{
                width: loveBoomerang.width,
                height: loveBoomerang.height,
                left: loveBoomerang.position.x - (startX * TILE_SIZE), 
                top: loveBoomerang.position.y - (startY * TILE_SIZE),
                filter: 'drop-shadow(0 0 3px #FFFFFF)',
            }}
        />
      )}

      {sootheAnimations.map(sa => {
        if (sa.position.x < startX || sa.position.x >= endX || sa.position.y < startY || sa.position.y >= endY) return null;
        if (canSee(playerState.position, sa.position, mazeGrid) && Math.sqrt(Math.pow(playerState.position.x - sa.position.x, 2) + Math.pow(playerState.position.y - sa.position.y, 2)) <= playerState.flashlightRadius + 1.0) {
          return <BoomerangHitAnimationIcon key={sa.id} className="absolute text-yellow-300 animate-soothe-impact" style={{ width: TILE_SIZE * 1.5, height: TILE_SIZE * 1.5, left: (sa.position.x - startX) * TILE_SIZE - TILE_SIZE * 0.25, top: (sa.position.y - startY) * TILE_SIZE - TILE_SIZE * 0.25, opacity: 0, '--soothe-animation-duration': `${SOOTHE_ANIMATION_DURATION}ms` } as React.CSSProperties} />;
        } return null;
      })}

      {confettiParticles.map(p => {
        const screenX = p.position.x - (startX * TILE_SIZE);
        const screenY = p.position.y - (startY * TILE_SIZE);
        if (screenX < -p.size || screenX > displayMazeWidth + p.size || screenY < -p.size || screenY > displayMazeHeight + p.size) return null;
        const confettiGridPos = { x: Math.floor(p.position.x / TILE_SIZE), y: Math.floor(p.position.y / TILE_SIZE) };
         if (canSee(playerState.position, confettiGridPos, mazeGrid) && Math.sqrt(Math.pow(playerState.position.x*TILE_SIZE - p.position.x, 2) + Math.pow(playerState.position.y*TILE_SIZE - p.position.y, 2))/TILE_SIZE <= playerState.flashlightRadius + 2.0) {
            const totalRotationDeg = p.rotationSpeed * (CONFETTI_LIFESPAN / 50); 
            return <ConfettiPieceIcon key={p.id} className="animate-confetti-fall" color={p.color} rotation={p.rotation} size={p.size} style={{ left: screenX, top: screenY, opacity: p.opacity, '--confetti-lifespan': `${CONFETTI_LIFESPAN}ms`, '--initial-rotation': `${p.rotation}deg`, '--rotation-amount': `${totalRotationDeg}deg` } as React.CSSProperties} />; 
         } return null;
      })}

      {lostWhispers.map(lw => {
        if (lw.position.x < startX || lw.position.x >= endX || lw.position.y < startY || lw.position.y >= endY) return null;
        if (canSee(playerState.position, lw.position, mazeGrid) && Math.sqrt(Math.pow(playerState.position.x - lw.position.x, 2) + Math.pow(playerState.position.y - lw.position.y, 2)) <= playerState.flashlightRadius + 0.8) {
          const isScaring = jumpScareEffect && jumpScareEffect.whisperId === lw.id;
          const whisperStyle: React.CSSProperties = { 
            width: TILE_SIZE * 0.75, 
            height: TILE_SIZE * 0.75, 
            left: (lw.position.x - startX) * TILE_SIZE + TILE_SIZE * 0.125, 
            top: (lw.position.y - startY) * TILE_SIZE + TILE_SIZE * 0.125, 
            opacity: Math.min(0.75, (playerState.flashlightRadius + 0.8 - Math.sqrt(Math.pow(playerState.position.x - lw.position.x, 2) + Math.pow(playerState.position.y - lw.position.y, 2))) + 0.3), 
            transition: `left ${ZOMBIE_VISUAL_MOVE_DURATION}ms linear, top ${ZOMBIE_VISUAL_MOVE_DURATION}ms linear, opacity 0.3s linear` 
          };
          if (isScaring) {
            (whisperStyle as any)['--jump-scare-duration'] = `${JUMP_SCARE_DURATION_MS}ms`;
          }

          return (
            <LostWhisperIcon 
              key={`${lw.id}-${startX}-${startY}-${jumpScareEffect?.key ?? ''}`} 
              className={`absolute text-teal-400 transform ${isScaring ? 'animate-jump-scare' : ''}`} 
              style={whisperStyle} 
            />
          );
        } return null;
      })}

      <PlayerIcon 
        className={playerIconClasses.join(' ')} 
        style={{ 
            width: pIconWidth, 
            height: pIconHeight, 
            left: pIconStyleLeft, 
            top: pIconStyleTop, 
            filter: playerState.hasShield ? 'drop-shadow(0 0 8px #ff80ab)' : 'none', 
            transition: 'left 0.05s linear, top 0.05s linear',
        }} 
      />
      <AimingArrowIcon
        className="absolute text-yellow-300"
        style={{
            width: arrowSize, 
            height: arrowSize,
            left: arrowEffectiveLeft,
            top: arrowEffectiveTop,
            transform: `rotate(${getRotationAngle(playerState.playerLastMoveDirection)}deg)`,
            transformOrigin: 'center center',
            transition: 'transform 0.1s linear, left 0.05s linear, top 0.05s linear', 
            pointerEvents: 'none', 
        }}
      />
    </div>
  );
};

export default MazeDisplay;
