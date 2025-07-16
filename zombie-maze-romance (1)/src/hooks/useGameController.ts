
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, PlayerState, LostWhisperState, ChestState, Position, LevelDefinition, Question, PowerUpType, CellType, Sparkle, LoveBoomerangState, PlayerDirection, ConfettiParticle, SootheAnimationState, DreamEssenceItem } from '../../types';
import { TILE_SIZE, INITIAL_PLAYER_HEARTS, MAX_PLAYER_HEARTS, FLASHLIGHT_INITIAL_RADIUS, FLASHLIGHT_RADIUS_INCREMENT, MAX_FLASHLIGHT_RADIUS, ZOMBIE_MOVE_INTERVAL_BASE, ZOMBIE_INTERVAL_DECREMENT_PER_LEVEL, MIN_ZOMBIE_MOVE_INTERVAL, ZOMBIES_PER_LEVEL_INCREMENT, MAX_LOST_WHISPERS_ON_SCREEN, ZOMBIE_VISUAL_MOVE_DURATION, TOTAL_LEVELS, LEVEL_TRANSITION_DURATION, MIN_LOADING_SCREEN_DURATION, FEEDBACK_MESSAGE_DURATION, SURPRISE_DURATION, TOTAL_LOVE_LETTER_FRAGMENTS, FULL_LOVE_LETTER, COUPLE_POWER_SOOTHE_DURATION, COUPLE_POWER_SOOTHE_RADIUS, FOLLOW_HEART_CLUE_TRIGGER_TIME, FOLLOW_HEART_CLUE_DURATION, MAX_CLUE_PATH_LENGTH, LAST_STAND_REVIVE_HEARTS, LAST_STAND_ANIMATION_DURATION, LAST_STAND_CLEAR_AREA_WIDTH, LAST_STAND_CLEAR_AREA_HEIGHT, SPARKLE_LIFESPAN, MAX_SPARKLES, LOVE_BOOMERANG_SPEED, LOVE_BOOMERANG_WIDTH, LOVE_BOOMERANG_HEIGHT, MAX_ACTIVE_BOOMERANGS, CONFETTI_PARTICLE_COUNT, CONFETTI_LIFESPAN, CONFETTI_GRAVITY, CONFETTI_INITIAL_VELOCITY_Y_MAX, CONFETTI_INITIAL_VELOCITY_Y_MIN, CONFETTI_INITIAL_VELOCITY_X_SPREAD, SOOTHE_ANIMATION_DURATION, SPAM_SHOT_COUNT, SPAM_WINDOW_MS, SHOOTING_PENALTY_MS, POWERUP_ICON_DETAILS, JUMP_SCARE_PROXIMITY_THRESHOLD, JUMP_SCARE_COOLDOWN_MS, JUMP_SCARE_DURATION_MS, REALITY_GLITCH_INTERVAL_CHECK_MS, REALITY_GLITCH_TRIGGER_CHANCE, REALITY_GLITCH_COOLDOWN_MS, REALITY_GLITCH_DURATION_MS, INITIAL_ACTIVE_WHISPERS_BASE, INITIAL_ACTIVE_WHISPERS_INCREMENT_PER_LEVEL, MAX_INITIAL_ACTIVE_WHISPERS, WHISPER_SPAWN_RADIUS, SOUNDS_TO_PRELOAD, SOUND_MUSIC_MENU, SOUND_MUSIC_GAMEPLAY, SOUND_PLAYER_SHOOT_BOOMERANG, SOUND_PLAYER_DAMAGE, SOUND_QUESTION_CORRECT, SOUND_REALITY_GLITCH, SOUND_JUMP_SCARE, SOUND_MUSIC_GAMEOVER, SOUND_MUSIC_CREDITS, SOUND_UI_CLICK } from '../../constants';
import { levels as levelDataService, parseMazeLayout } from '../../services/levelData'; // Renamed to avoid conflict
import { generateMaze } from '../utils/mazeGenerator';
import { canSee } from '../utils/los';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { useSoundManager } from './useSoundManager';

export interface PortalKeyOnMap {
  position: Position;
  isVisible: boolean;
}

interface WhisperSpawnTrigger {
  id: string;
  position: Position;
  hasSpawned: boolean;
  spawnRadius: number;
}

const initialPlayerStateHook: PlayerState = {
  position: { x: 0, y: 0 },
  hearts: INITIAL_PLAYER_HEARTS,
  maxHearts: MAX_PLAYER_HEARTS,
  flashlightRadius: FLASHLIGHT_INITIAL_RADIUS,
  hasShield: false,
  attackPower: 1,
  loveLetterFragmentsCollected: new Set<number>(),
  isCouplePowerActive: false,
  couplePowerDuration: 0,
  lastStandUsed: false,
  hasPortalKey: false,
  firstWhisperHugThisGame: false, // Changed from firstWhisperHugThisLevel
  playerLastMoveDirection: 'down',
  dreamEssenceCollected: 0,
};

interface HeartLossAnimDataType {
  index: number;
  triggerKey: number;
}

interface JumpScareEffectType {
  whisperId: string;
  position: Position;
  key: number;
}

export const useGameController = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START_SCREEN);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [playerState, setPlayerState] = useState<PlayerState>(initialPlayerStateHook);
  const [mazeGrid, setMazeGrid] = useState<CellType[][]>([]);
  const [doorPosition, setDoorPosition] = useState<Position | undefined>(undefined);
  const [lostWhispers, setLostWhispers] = useState<LostWhisperState[]>([]);
  const [giftBoxes, setGiftBoxes] = useState<ChestState[]>([]);
  const [portalKeyOnMap, setPortalKeyOnMap] = useState<PortalKeyOnMap | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [levelBriefing, setLevelBriefing] = useState<string | undefined>(undefined);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string, type: 'success' | 'error' | 'info' } | null>(null);
  const [surpriseActive, setSurpriseActive] = useState<boolean>(false);
  const [currentWhisperMoveInterval, setCurrentWhisperMoveInterval] = useState<number>(ZOMBIE_MOVE_INTERVAL_BASE);
  const [timeOnLevelWithoutProgress, setTimeOnLevelWithoutProgress] = useState<number>(0);
  const [heartCluePath, setHeartCluePath] = useState<Position[] | null>(null);
  const [heartClueVisibleTime, setHeartClueVisibleTime] = useState<number>(0);
  const [isLastStandAnimating, setIsLastStandAnimating] = useState<boolean>(false);

  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [animatingGiftBoxPosition, setAnimatingGiftBoxPosition] = useState<Position | null>(null);

  const [loveBoomerang, setLoveBoomerang] = useState<LoveBoomerangState | null>(null);
  const [isBoomerangOnCooldown, setIsBoomerangOnCooldown] = useState<boolean>(false);
  const boomerangCooldownTimerRef = useRef<number | null>(null);
  const [sootheAnimations, setSootheAnimations] = useState<SootheAnimationState[]>([]);
  const [confettiParticles, setConfettiParticles] = useState<ConfettiParticle[]>([]);
  const [playerChoiceOptions, setPlayerChoiceOptions] = useState<[PowerUpType, PowerUpType] | null>(null);
  const [playerChoicePrompt, setPlayerChoicePrompt] = useState<string | null>(null);

  const [aiCoachMessage, setAiCoachMessage] = useState<string | null>(null);
  const [isAiCoachLoading, setIsAiCoachLoading] = useState<boolean>(false);
  const [isAiCoachModalOpen, setIsAiCoachModalOpen] = useState<boolean>(false);

  const [dreamEssenceItems, setDreamEssenceItems] = useState<DreamEssenceItem[]>([]);
  const [isDreamWeaverModalOpen, setIsDreamWeaverModalOpen] = useState<boolean>(false);
  const [isDreamWeaverLoading, setIsDreamWeaverLoading] = useState<boolean>(false);

  const ai = useRef(new GoogleGenAI({ apiKey: process.env.API_KEY! }));

  const couplePowerIntervalRef = useRef<number | null>(null);
  const progressTimerRef = useRef<number | null>(null);
  const clueVisibilityTimerRef = useRef<number | null>(null);
  const playerPositionRef = useRef(playerState.position);
  const playerStateRef = useRef(playerState);
  const gameStateRef = useRef(gameState); // Ref for gameState

  const [shootingPenaltyEndTime, setShootingPenaltyEndTime] = useState<number>(0);
  const fireTimestampsRef = useRef<number[]>([]);
  const penaltyEndClearTimerRef = useRef<number | null>(null);

  const [heartLossAnimData, setHeartLossAnimData] = useState<HeartLossAnimDataType | null>(null);
  const [damageFlashTrigger, setDamageFlashTrigger] = useState<number | null>(null);

  const [jumpScareEffect, setJumpScareEffect] = useState<JumpScareEffectType | null>(null);
  const lastJumpScareTimestampRef = useRef<number>(0);
  const prevTickPotentiallyScaryWhispersRef = useRef<Set<string>>(new Set());
  
  const [realityGlitchTriggerKey, setRealityGlitchTriggerKey] = useState<number | null>(null);
  const lastRealityGlitchTimestampRef = useRef<number>(0);
  const realityGlitchTimerRef = useRef<number | null>(null);

  const dreamEssenceSpawnLevelRef = useRef<number | null>(null);
  const dreamEssenceHasSpawnedThisGameRef = useRef<boolean>(false);
  
  const [whisperSpawnTriggers, setWhisperSpawnTriggers] = useState<WhisperSpawnTrigger[]>([]);

  // Timer states
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [gameEndTime, setGameEndTime] = useState<number | null>(null);
  const [totalElapsedTime, setTotalElapsedTime] = useState<number>(0);
  const [elapsedTimeForHUD, setElapsedTimeForHUD] = useState<number>(0);

  const { playSound, stopSound, stopAllSounds, preloadSounds, isAudioContextAllowed } = useSoundManager();

  useEffect(() => {
    preloadSounds(SOUNDS_TO_PRELOAD);
  }, [preloadSounds]);


  useEffect(() => {
    playerPositionRef.current = playerState.position;
    playerStateRef.current = playerState;
  }, [playerState]);

  useEffect(() => {
    gameStateRef.current = gameState;
    // Sound management based on gameState
    switch (gameState) {
      case GameState.START_SCREEN:
        stopAllSounds(); // Stop any lingering sounds
        playSound(SOUND_MUSIC_MENU, true, true);
        break;
      case GameState.PLAYING:
        if (isAudioContextAllowed) { // Only play gameplay music if audio allowed
          stopSound(SOUND_MUSIC_MENU);
          playSound(SOUND_MUSIC_GAMEPLAY, true, true);
        }
        break;
      case GameState.GAME_OVER:
        stopSound(SOUND_MUSIC_GAMEPLAY);
        playSound(SOUND_MUSIC_GAMEOVER, true, true);
        break;
      case GameState.CREDITS:
        stopSound(SOUND_MUSIC_GAMEPLAY);
        stopSound(SOUND_MUSIC_GAMEOVER); // Ensure game over music stops if transitioning from there
        playSound(SOUND_MUSIC_CREDITS, true, true);
        break;
      case GameState.LEVEL_TRANSITION:
      case GameState.PAUSED_QUESTION:
      case GameState.PAUSED_PLAYER_CHOICE:
      case GameState.GAME_PAUSED:
        // Potentially pause or lower volume of gameplay music, or let it continue
        // For simplicity, we can let it continue or stop it. Let's stop it for pause.
        if (gameState === GameState.GAME_PAUSED || gameState === GameState.PAUSED_QUESTION || gameState === GameState.PAUSED_PLAYER_CHOICE ) {
            // No explicit stop here, music might continue or be handled by playSound logic if it restarts on PLAYING
        }
        break;
    }


    if ((gameState === GameState.CREDITS || gameState === GameState.GAME_OVER) && gameStartTime && !gameEndTime) {
        const endTime = Date.now();
        setGameEndTime(endTime);
        setTotalElapsedTime((endTime - gameStartTime) / 1000);
    }
  }, [gameState, gameStartTime, gameEndTime, playSound, stopSound, stopAllSounds, isAudioContextAllowed]);

  // HUD Timer Effect
  useEffect(() => {
    let timerInterval: number | null = null;
    if (gameStateRef.current === GameState.PLAYING && gameStartTime) {
      setElapsedTimeForHUD((Date.now() - gameStartTime) / 1000);

      timerInterval = window.setInterval(() => {
        if (gameStateRef.current === GameState.PLAYING && gameStartTime) {
          setElapsedTimeForHUD((Date.now() - gameStartTime) / 1000);
        } else {
          if (timerInterval) clearInterval(timerInterval); 
        }
      }, 1000);
    } else {
      if (!gameStartTime) { 
          setElapsedTimeForHUD(0);
      }
      if (timerInterval) clearInterval(timerInterval);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [gameState, gameStartTime]); 


  const showFeedback = useCallback((text: string, type: 'success' | 'error' | 'info') => {
    setFeedbackMessage({ text, type });
    setTimeout(() => setFeedbackMessage(null), FEEDBACK_MESSAGE_DURATION);
  }, []);

  const triggerSurprise = useCallback(() => {
    setSurpriseActive(true);
    setTimeout(() => {
      setSurpriseActive(false);
    }, SURPRISE_DURATION);
  }, []);

  const clearRomanticTwistTimers = useCallback(() => {
    if (couplePowerIntervalRef.current) clearInterval(couplePowerIntervalRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    if (clueVisibilityTimerRef.current) clearInterval(clueVisibilityTimerRef.current);
    if (boomerangCooldownTimerRef.current) clearTimeout(boomerangCooldownTimerRef.current);
    if (penaltyEndClearTimerRef.current) clearTimeout(penaltyEndClearTimerRef.current);
    if (realityGlitchTimerRef.current) clearInterval(realityGlitchTimerRef.current);
  }, []);

  const fetchAiCoachAdvice = useCallback(async () => {
    if (!ai.current) {
      setAiCoachMessage("AI Coach is dreaming... please try again later.");
      setIsAiCoachModalOpen(true);
      return;
    }
    setIsAiCoachLoading(true);
    setIsAiCoachModalOpen(true);
    try {
      const prompt = `You are a whimsical and wise AI Romantic Coach. The player just found a "Love Letter Fragment" in a romantic game. Offer a very short (1-2 sentences), sweet, and positive piece of relationship advice. Be encouraging and lighthearted.`;
      const response: GenerateContentResponse = await ai.current.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt,
      });
      setAiCoachMessage(response.text || "Cherish every shared moment, big or small! They build a beautiful story. 💕");
    } catch (error) {
      console.error("AI Coach Error:", error);
      setAiCoachMessage("The whispers of love are a bit tangled right now, but your connection is strong!");
    } finally {
      setIsAiCoachLoading(false);
    }
  }, [ai]);

  const initializeLevel = useCallback((levelNumber: number) => {
    const levelDefFromService = levelDataService.find(l => l.levelNumber === levelNumber);
    if (!levelDefFromService) {
      setGameState(GameState.CREDITS); 
      return;
    }

    if (levelNumber === 1 && !gameStartTime) {
        const startTime = Date.now();
        setGameStartTime(startTime);
        setElapsedTimeForHUD(0); 
        setGameEndTime(null);
        setTotalElapsedTime(0);
    }

    const mazeBaseWidth = 7;
    const mazeBaseHeight = 3;
    const mazeWidth = mazeBaseWidth + (levelNumber * 2);
    const mazeHeight = mazeBaseHeight + (levelNumber * 2);

    const { grid: newMazeGrid, playerStart, doorPosition: generatedDoorPos } = generateMaze(mazeWidth, mazeHeight);

    setMazeGrid(newMazeGrid);
    setDoorPosition(generatedDoorPos);
    setLevelBriefing(levelDefFromService.briefing);

    const persistentStateFromPreviousLevel = playerStateRef.current;

    setPlayerState({
      ...persistentStateFromPreviousLevel,
      position: playerStart,
      playerLastMoveDirection: 'down',
      hasShield: false,
      isCouplePowerActive: false,
      couplePowerDuration: 0,
      hasPortalKey: false,
      dreamEssenceCollected: levelNumber === 1 ? 0 : persistentStateFromPreviousLevel.dreamEssenceCollected,
    });


    const availableFloorTiles: Position[] = [];
    newMazeGrid.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === CellType.FLOOR && !(x === playerStart.x && y === playerStart.y) && !(generatedDoorPos && x === generatedDoorPos.x && y === generatedDoorPos.y) ) {
                availableFloorTiles.push({ x, y });
            }
        });
    });

    const shuffleArray = (array: any[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };
    shuffleArray(availableFloorTiles);

    if (availableFloorTiles.length > 0) {
        const keyPos = availableFloorTiles.pop()!;
        setPortalKeyOnMap({ position: keyPos, isVisible: true });
    } else {
        setPortalKeyOnMap(null);
    }

    const questionsForLevel = levelDefFromService.questions;
    const numChestsToCreate = questionsForLevel.length; 
    const newGiftBoxes: ChestState[] = [];

    for (let i = 0; i < numChestsToCreate && availableFloorTiles.length > 0 && questionsForLevel[i]; i++) {
        const chestPos = availableFloorTiles.pop()!;
        newGiftBoxes.push({
            id: `gb-${levelNumber}-${i}`,
            position: chestPos,
            questionId: questionsForLevel[i].id,
            isOpen: false,
            isSurpriseChest: Math.random() < 0.2,
        });
    }
    setGiftBoxes(newGiftBoxes);

    setDreamEssenceItems([]);
    let shouldSpawnEssence = false;
    if (!dreamEssenceHasSpawnedThisGameRef.current) {
        if (dreamEssenceSpawnLevelRef.current === levelNumber) {
            shouldSpawnEssence = true;
        } else if (levelNumber === TOTAL_LEVELS) {
            shouldSpawnEssence = true;
        }
    }

    if (shouldSpawnEssence && availableFloorTiles.length > 0) {
        const essencePos = availableFloorTiles.pop()!;
        setDreamEssenceItems([{ id: `de-${levelNumber}-0`, position: essencePos }]);
        dreamEssenceHasSpawnedThisGameRef.current = true;
    }

    const baseWhispersForLevelCalc = 3; 
    const totalPotentialWhispers = baseWhispersForLevelCalc + (levelNumber - 1) * ZOMBIES_PER_LEVEL_INCREMENT;

    let numInitialActive = Math.floor(INITIAL_ACTIVE_WHISPERS_BASE + (levelNumber - 1) * INITIAL_ACTIVE_WHISPERS_INCREMENT_PER_LEVEL);
    numInitialActive = Math.min(numInitialActive, MAX_INITIAL_ACTIVE_WHISPERS, totalPotentialWhispers);
    numInitialActive = Math.min(numInitialActive, MAX_LOST_WHISPERS_ON_SCREEN);


    const newLostWhispersActive: LostWhisperState[] = [];
    for (let i = 0; i < numInitialActive && availableFloorTiles.length > 0; i++) {
        const whisperPos = availableFloorTiles.pop()!;
        newLostWhispersActive.push({ id: `lw-initial-${levelNumber}-${i}`, position: whisperPos, health: 1 });
    }
    setLostWhispers(newLostWhispersActive);

    const numSpawnTriggers = totalPotentialWhispers - numInitialActive;
    const newSpawnTriggers: WhisperSpawnTrigger[] = [];
    for (let i = 0; i < numSpawnTriggers && availableFloorTiles.length > 0; i++) {
        const triggerPos = availableFloorTiles.pop()!;
        newSpawnTriggers.push({
            id: `wst-${levelNumber}-${i}`,
            position: triggerPos,
            hasSpawned: false,
            spawnRadius: WHISPER_SPAWN_RADIUS
        });
    }
    setWhisperSpawnTriggers(newSpawnTriggers);


    clearRomanticTwistTimers();
    const calculatedInterval = Math.max(MIN_ZOMBIE_MOVE_INTERVAL, ZOMBIE_MOVE_INTERVAL_BASE - (levelNumber - 1) * ZOMBIE_INTERVAL_DECREMENT_PER_LEVEL);
    setCurrentWhisperMoveInterval(calculatedInterval);

    setActiveQuestion(null);
    setSurpriseActive(false);
    setIsLastStandAnimating(false);
    setTimeOnLevelWithoutProgress(0);
    setHeartCluePath(null);
    setHeartClueVisibleTime(0);
    setSparkles([]);
    setAnimatingGiftBoxPosition(null);
    setLoveBoomerang(null);
    setIsBoomerangOnCooldown(false);
    setSootheAnimations([]);
    setConfettiParticles([]);
    setPlayerChoiceOptions(null);
    setPlayerChoicePrompt(null);
    setIsAiCoachModalOpen(false);
    setAiCoachMessage(null);
    setIsAiCoachLoading(false);
    setIsDreamWeaverModalOpen(false);
    setIsDreamWeaverLoading(false);
    setShootingPenaltyEndTime(0);
    fireTimestampsRef.current = [];
    if (penaltyEndClearTimerRef.current) clearTimeout(penaltyEndClearTimerRef.current);
    penaltyEndClearTimerRef.current = null;
    setHeartLossAnimData(null);
    setDamageFlashTrigger(null);
    setJumpScareEffect(null);
    lastJumpScareTimestampRef.current = 0;
    prevTickPotentiallyScaryWhispersRef.current.clear();
    setRealityGlitchTriggerKey(null);
    lastRealityGlitchTimestampRef.current = 0;
    if (realityGlitchTimerRef.current) clearInterval(realityGlitchTimerRef.current);
    realityGlitchTimerRef.current = null;
    
    setGameState(GameState.LEVEL_TRANSITION);
    const transitionDisplayTime = Math.max(LEVEL_TRANSITION_DURATION, MIN_LOADING_SCREEN_DURATION);
    setTimeout(() => { 
        setGameState(GameState.PLAYING); 
        setLevelBriefing(undefined); 
    }, transitionDisplayTime);
  }, [clearRomanticTwistTimers, fetchAiCoachAdvice, gameStartTime, playSound, stopSound]);

  const resetGame = useCallback(() => {
    clearRomanticTwistTimers();
    stopAllSounds();
    dreamEssenceSpawnLevelRef.current = Math.floor(Math.random() * TOTAL_LEVELS) + 1;
    dreamEssenceHasSpawnedThisGameRef.current = false;

    setPlayerState({...initialPlayerStateHook});
    setWhisperSpawnTriggers([]); 

    setCurrentLevel(1);
    setActiveQuestion(null);
    setFeedbackMessage(null);
    setSurpriseActive(false);
    setIsLastStandAnimating(false);
    setCurrentWhisperMoveInterval(ZOMBIE_MOVE_INTERVAL_BASE);
    setTimeOnLevelWithoutProgress(0);
    setHeartCluePath(null);
    setHeartClueVisibleTime(0);
    setPortalKeyOnMap(null);
    setSparkles([]);
    setAnimatingGiftBoxPosition(null);
    setLoveBoomerang(null);
    setIsBoomerangOnCooldown(false);
    setSootheAnimations([]);
    setConfettiParticles([]);
    setPlayerChoiceOptions(null);
    setPlayerChoicePrompt(null);
    setIsAiCoachModalOpen(false);
    setAiCoachMessage(null);
    setIsAiCoachLoading(false);
    setDreamEssenceItems([]);
    setIsDreamWeaverModalOpen(false);
    setIsDreamWeaverLoading(false);
    setShootingPenaltyEndTime(0);
    fireTimestampsRef.current = [];
    if (penaltyEndClearTimerRef.current) clearTimeout(penaltyEndClearTimerRef.current);
    penaltyEndClearTimerRef.current = null;
    setHeartLossAnimData(null);
    setDamageFlashTrigger(null);
    setJumpScareEffect(null);
    lastJumpScareTimestampRef.current = 0;
    prevTickPotentiallyScaryWhispersRef.current.clear();
    setRealityGlitchTriggerKey(null);
    lastRealityGlitchTimestampRef.current = 0;
    if (realityGlitchTimerRef.current) clearInterval(realityGlitchTimerRef.current);
    realityGlitchTimerRef.current = null;
    
    setGameStartTime(null);
    setGameEndTime(null);
    setTotalElapsedTime(0);
    setElapsedTimeForHUD(0); 

    setGameState(GameState.START_SCREEN);
  }, [clearRomanticTwistTimers, stopAllSounds]);

  const handleResumeGame = useCallback(() => {
    playSound(SOUND_UI_CLICK);
    setGameState(GameState.PLAYING);
    // Gameplay music should resume due to gameState change effect if audio context is active
  }, [playSound]);

  const handleReturnToMainMenu = useCallback(() => {
    playSound(SOUND_UI_CLICK);
    resetGame();
  }, [resetGame, playSound]);

  const moveLostWhispersLogic = useCallback(() => {
    if (gameStateRef.current !== GameState.PLAYING || !mazeGrid || mazeGrid.length === 0) return;
    setLostWhispers(prevWhispers => {
      const occupiedByCurrentWhispers = new Set(prevWhispers.map(lw => `${lw.position.x},${lw.position.y}`));
      const claimedNextStepsThisTick = new Set<string>();
      const newWhisperStates = prevWhispers.map(whisper => {
        let potentialNextStep = { ...whisper.position };
        const startPos = whisper.position;
        const targetPos = playerPositionRef.current;
        if (startPos.x === targetPos.x && startPos.y === targetPos.y) {
          claimedNextStepsThisTick.add(`${startPos.x},${startPos.y}`);
          return { ...whisper, position: startPos };
        }
        const queue: Position[] = [startPos];
        const visitedParentMap = new Map<string, Position | null>();
        visitedParentMap.set(`${startPos.x},${startPos.y}`, null);
        let pathFound = false;
        let determinedStep = { ...startPos };
        while (queue.length > 0) {
          const current = queue.shift();
          if (!current) continue;
          if (current.x === targetPos.x && current.y === targetPos.y) {
            pathFound = true;
            break;
          }
          let neighbors = [
            { x: current.x, y: current.y - 1 }, { x: current.x, y: current.y + 1 },
            { x: current.x - 1, y: current.y }, { x: current.x + 1, y: current.y },
          ];
          for (let i = neighbors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]];
          }
          for (const neighbor of neighbors) {
            const neighborKey = `${neighbor.x},${neighbor.y}`;
            if (
              neighbor.x >= 0 && neighbor.x < (mazeGrid[0]?.length || 0) &&
              neighbor.y >= 0 && neighbor.y < mazeGrid.length &&
              mazeGrid[neighbor.y][neighbor.x] !== CellType.WALL &&
              mazeGrid[neighbor.y][neighbor.x] !== CellType.DOOR &&
              !visitedParentMap.has(neighborKey)
            ) {
              visitedParentMap.set(neighborKey, current);
              queue.push(neighbor);
            }
          }
        }
        if (pathFound) {
          let reconstructPos = targetPos;
          let pathSegmentKey = `${reconstructPos.x},${reconstructPos.y}`;
          while (visitedParentMap.has(pathSegmentKey)) {
            const parent = visitedParentMap.get(pathSegmentKey);
            if (!parent) break;
            if (parent.x === startPos.x && parent.y === startPos.y) {
              determinedStep = reconstructPos;
              break;
            }
            reconstructPos = parent;
            pathSegmentKey = `${reconstructPos.x},${reconstructPos.y}`;
            if (!visitedParentMap.has(pathSegmentKey) && visitedParentMap.get(pathSegmentKey) !== null) break;
          }
        } else {
          const validRandomMoves: Position[] = [
            { x: startPos.x, y: startPos.y - 1 }, { x: startPos.x, y: startPos.y + 1 },
            { x: startPos.x - 1, y: startPos.y }, { x: startPos.x + 1, y: startPos.y }
          ].filter(m =>
            m.y >= 0 && m.y < mazeGrid.length &&
            m.x >= 0 && m.x < (mazeGrid[0]?.length || 0) &&
            mazeGrid[m.y][m.x] !== CellType.WALL &&
            mazeGrid[m.y][m.x] !== CellType.DOOR
          );
          if (validRandomMoves.length > 0) {
            determinedStep = validRandomMoves[Math.floor(Math.random() * validRandomMoves.length)];
          }
        }
        potentialNextStep = determinedStep;
        const potentialNextStepKey = `${potentialNextStep.x},${potentialNextStep.y}`;
        let isBlocked = false;
        if (occupiedByCurrentWhispers.has(potentialNextStepKey) || claimedNextStepsThisTick.has(potentialNextStepKey)) {
          if (!(potentialNextStep.x === whisper.position.x && potentialNextStep.y === whisper.position.y)) {
            isBlocked = true;
          }
        }
        if (isBlocked) {
          claimedNextStepsThisTick.add(`${whisper.position.x},${whisper.position.y}`);
          return { ...whisper };
        } else {
          claimedNextStepsThisTick.add(potentialNextStepKey);
          return { ...whisper, position: potentialNextStep };
        }
      });
      return newWhisperStates;
    });
  }, [mazeGrid]);

  const triggerLastStand = useCallback((collidedWhisperId: string | null) => {
    setPlayerState(p => ({ ...p, lastStandUsed: true, hearts: LAST_STAND_REVIVE_HEARTS }));
    setIsLastStandAnimating(true);
    setHeartLossAnimData({ index: 0, triggerKey: Date.now() });
    setDamageFlashTrigger(Date.now());
    playSound(SOUND_PLAYER_DAMAGE); // Reuse damage sound or a specific "last stand activate" sound
    setTimeout(() => setIsLastStandAnimating(false), LAST_STAND_ANIMATION_DURATION);
    showFeedback("A surge of love protects you! You feel revived!", "success");
    const px = playerStateRef.current.position.x;
    const py = playerStateRef.current.position.y;
    setLostWhispers(prevLWs => prevLWs.filter(lw => {
      if (lw.id === collidedWhisperId) return false;
      const inXRange = lw.position.x >= (px - 1) && lw.position.x <= (px + (LAST_STAND_CLEAR_AREA_WIDTH - 2));
      const inYRange = lw.position.y >= (py - 1) && lw.position.y <= (py + (LAST_STAND_CLEAR_AREA_HEIGHT - 2));
      return !(inXRange && inYRange);
    }));
  }, [showFeedback, playSound]);

  const handlePlayerDamage = useCallback((collidedWhisperId: string | null) => {
    if (gameStateRef.current !== GameState.PLAYING) return;
    let actualDamageTaken = false;
    const currentPlayerState = playerStateRef.current;

    if (currentPlayerState.hasShield) {
      setPlayerState(p => ({ ...p, hasShield: false }));
      if (collidedWhisperId) setLostWhispers(prevLWs => prevLWs.filter(lw => lw.id !== collidedWhisperId));
      showFeedback("Your love shield protected you!", "success");
      // playSound(SOUND_SHIELD_BLOCK); // Optional: shield block sound
      return;
    }
    if (!currentPlayerState.firstWhisperHugThisGame) {
      setPlayerState(p => ({ ...p, firstWhisperHugThisGame: true }));
      if (collidedWhisperId) setLostWhispers(prevLWs => prevLWs.filter(lw => lw.id !== collidedWhisperId));
      showFeedback("A Lost Whisper gives you a gentle (but slightly clumsy) hug! It seems friendly, just a bit lost.", "info");
      // playSound(SOUND_FRIENDLY_HUG); // Optional: gentle hug sound
      return;
    }
    if (currentPlayerState.hearts === 1 && !currentPlayerState.lastStandUsed) {
      triggerLastStand(collidedWhisperId);
      actualDamageTaken = true; 
    } else {
      const newHearts = currentPlayerState.hearts - 1;
      setPlayerState(p => ({ ...p, hearts: newHearts <= 0 ? 0 : newHearts }));
      setHeartLossAnimData({ index: newHearts, triggerKey: Date.now() });
      if (collidedWhisperId) setLostWhispers(prevLWs => prevLWs.filter(lw => lw.id !== collidedWhisperId));
      if (newHearts > 0) showFeedback("Oh no! A Lost Whisper's hug was a bit too much!", "error");
      actualDamageTaken = true;
    }

    if (actualDamageTaken) {
      playSound(SOUND_PLAYER_DAMAGE);
      setDamageFlashTrigger(Date.now());
    }
  }, [triggerLastStand, showFeedback, playSound]);

  const handlePlayerMove = useCallback((dx: number, dy: number) => {
    if (gameStateRef.current !== GameState.PLAYING || !mazeGrid.length) return;
    const currentPos = playerStateRef.current.position;
    const newPos = { x: currentPos.x + dx, y: currentPos.y + dy };

    let newDirection: PlayerDirection = playerStateRef.current.playerLastMoveDirection;
    if (dx === 1) newDirection = 'right';
    else if (dx === -1) newDirection = 'left';
    else if (dy === 1) newDirection = 'down';
    else if (dy === -1) newDirection = 'up';


    if (newPos.x < 0 || newPos.x >= (mazeGrid[0]?.length || 0) || newPos.y < 0 || newPos.y >= mazeGrid.length || mazeGrid[newPos.y][newPos.x] === CellType.WALL) return;

    setSparkles(prevSparkles => {
      const newSparkle: Sparkle = { id: Date.now().toString(), position: { ...currentPos }, createdAt: Date.now() };
      return [newSparkle, ...prevSparkles].slice(0, MAX_SPARKLES);
    });
    setTimeOnLevelWithoutProgress(0);

    const essenceOnTile = dreamEssenceItems.find(de => de.position.x === newPos.x && de.position.y === newPos.y);
    if (essenceOnTile) {
      setPlayerState(p => ({ ...p, dreamEssenceCollected: p.dreamEssenceCollected + 1 }));
      setDreamEssenceItems(prevDE => prevDE.filter(de => de.id !== essenceOnTile.id));
      showFeedback("You found some Dream Essence!", "success");
      // playSound(SOUND_ESSENCE_COLLECT);
    }

    const whisperAtNewPos = lostWhispers.find(lw => lw.position.x === newPos.x && lw.position.y === newPos.y);
    if (whisperAtNewPos) {
      setPlayerState(p => ({ ...p, position: newPos, playerLastMoveDirection: newDirection }));
      handlePlayerDamage(whisperAtNewPos.id);
      return;
    }
    setPlayerState(p => ({ ...p, position: newPos, playerLastMoveDirection: newDirection }));
    if (portalKeyOnMap && portalKeyOnMap.isVisible && newPos.x === portalKeyOnMap.position.x && newPos.y === portalKeyOnMap.position.y) {
      setPlayerState(p => ({ ...p, hasPortalKey: true }));
      setPortalKeyOnMap(prev => prev ? { ...prev, isVisible: false } : null);
      showFeedback("You found the Portal Key! ✨ The way to the next dream can now be opened.", "success");
      // playSound(SOUND_KEY_COLLECT);
    }
    if (doorPosition && newPos.x === doorPosition.x && newPos.y === doorPosition.y) {
      if (!playerStateRef.current.hasPortalKey) {
        showFeedback("The portal shimmers... but it seems locked. You need a special key!", "info");
        // playSound(SOUND_PORTAL_LOCKED);
        return;
      }
      // playSound(SOUND_PORTAL_OPEN);
      if (currentLevel < TOTAL_LEVELS) {
        const nextLevelNum = currentLevel + 1;
        setCurrentLevel(nextLevelNum);
        initializeLevel(nextLevelNum);
      } else {
        setGameState(GameState.CREDITS); 
      }
      return;
    }
    const giftBoxOnTile = giftBoxes.find(gb => gb.position.x === newPos.x && gb.position.y === newPos.y && !gb.isOpen);
    if (giftBoxOnTile) {
      // playSound(SOUND_CHEST_OPEN_ATTEMPT); 
      const levelDef = levelDataService.find(l => l.levelNumber === currentLevel);
      const questionForGiftBox = levelDef?.questions.find(q => q.id === giftBoxOnTile.questionId);
      if (questionForGiftBox) {
        setActiveQuestion(questionForGiftBox);
        setGameState(GameState.PAUSED_QUESTION);
        setTimeOnLevelWithoutProgress(0);
        setAnimatingGiftBoxPosition(giftBoxOnTile.position);
        if (giftBoxOnTile.isSurpriseChest) triggerSurprise();
      }
      return;
    }
  }, [mazeGrid, lostWhispers, doorPosition, giftBoxes, currentLevel, initializeLevel, triggerSurprise, handlePlayerDamage, portalKeyOnMap, showFeedback, dreamEssenceItems, playSound]);

  const handleSootheAction = useCallback((forcedDirection?: PlayerDirection) => {
    if (gameStateRef.current !== GameState.PLAYING) return;
    const currentPlayerState = playerStateRef.current;

    if (shootingPenaltyEndTime > Date.now()) {
      const remainingPenalty = Math.ceil((shootingPenaltyEndTime - Date.now()) / 1000);
      showFeedback(`Shooting penalized! Wait ${remainingPenalty} seconds.`, "error");
      return;
    }

    const now = Date.now();
    fireTimestampsRef.current.push(now);
    fireTimestampsRef.current = fireTimestampsRef.current.filter(
      timestamp => now - timestamp < SPAM_WINDOW_MS
    );

    if (fireTimestampsRef.current.length >= SPAM_SHOT_COUNT) {
      setShootingPenaltyEndTime(Date.now() + SHOOTING_PENALTY_MS);
      showFeedback(`Too many shots! Shooting penalized for ${SHOOTING_PENALTY_MS / 1000} seconds.`, "error");
      fireTimestampsRef.current = [];

      if (boomerangCooldownTimerRef.current) clearTimeout(boomerangCooldownTimerRef.current);
      setIsBoomerangOnCooldown(false);

      if (penaltyEndClearTimerRef.current) clearTimeout(penaltyEndClearTimerRef.current);
      penaltyEndClearTimerRef.current = window.setTimeout(() => {
        showFeedback("Shooting penalty ended.", "info");
        setShootingPenaltyEndTime(0);
      }, SHOOTING_PENALTY_MS);
      return;
    }

    if (isBoomerangOnCooldown) return;

    playSound(SOUND_PLAYER_SHOOT_BOOMERANG);
    const directionToUse = forcedDirection || currentPlayerState.playerLastMoveDirection;
    const newBoomerang: LoveBoomerangState = {
      id: `boom-${Date.now()}`,
      position: {
        x: currentPlayerState.position.x * TILE_SIZE + TILE_SIZE / 2 - LOVE_BOOMERANG_WIDTH / 2,
        y: currentPlayerState.position.y * TILE_SIZE + TILE_SIZE / 2 - LOVE_BOOMERANG_HEIGHT / 2
      },
      direction: directionToUse,
      isActive: true,
      width: LOVE_BOOMERANG_WIDTH,
      height: LOVE_BOOMERANG_HEIGHT,
    };
    setLoveBoomerang(newBoomerang);
    setIsBoomerangOnCooldown(true);
    if(boomerangCooldownTimerRef.current) clearTimeout(boomerangCooldownTimerRef.current);
    boomerangCooldownTimerRef.current = window.setTimeout(() => {
        setIsBoomerangOnCooldown(false);
    }, 1000);

  }, [isBoomerangOnCooldown, shootingPenaltyEndTime, showFeedback, playSound]);

  const handleAimAndShoot = useCallback((direction: PlayerDirection) => {
    if (gameStateRef.current !== GameState.PLAYING) return;
    setPlayerState(prev => ({ ...prev, playerLastMoveDirection: direction }));
    handleSootheAction(direction);
  }, [handleSootheAction]);

  const applyPowerUp = useCallback((powerUp: PowerUpType) => {
    setPlayerState(prev => {
      let newState = { ...prev };
      switch (powerUp) {
        case PowerUpType.EXTRA_HEART:
          if (newState.hearts < newState.maxHearts) newState.hearts += 1;
          else {
            if (newState.maxHearts < MAX_PLAYER_HEARTS) {
                newState.maxHearts +=1;
                newState.hearts +=1;
            }
          }
          break;
        case PowerUpType.INCREASE_FLASHLIGHT:
          newState.flashlightRadius = Math.min(MAX_FLASHLIGHT_RADIUS, newState.flashlightRadius + FLASHLIGHT_RADIUS_INCREMENT);
          break;
        case PowerUpType.TEMPORARY_SHIELD:
          newState.hasShield = true;
          break;
        case PowerUpType.LOVE_LETTER_FRAGMENT:
          if (activeQuestion?.loveLetterFragmentId !== undefined) {
            newState.loveLetterFragmentsCollected = new Set(newState.loveLetterFragmentsCollected).add(activeQuestion.loveLetterFragmentId);
          }
          break;
        case PowerUpType.COUPLE_POWER_SOOTHE:
          newState.isCouplePowerActive = true;
          newState.couplePowerDuration = COUPLE_POWER_SOOTHE_DURATION;
          if (couplePowerIntervalRef.current) clearInterval(couplePowerIntervalRef.current);
          couplePowerIntervalRef.current = window.setInterval(() => {
            setPlayerState(p => {
              if (gameStateRef.current === GameState.GAME_PAUSED || gameStateRef.current !== GameState.PLAYING) { 
                return p;
              }
              const newDuration = p.couplePowerDuration - 1000;
              if (newDuration <= 0) {
                if (couplePowerIntervalRef.current) clearInterval(couplePowerIntervalRef.current);
                return { ...p, isCouplePowerActive: false, couplePowerDuration: 0 };
              }
              return { ...p, couplePowerDuration: newDuration };
            });
          }, 1000);
          break;
        case PowerUpType.INCREASE_SOOTHE_POWER:
            newState.attackPower = Math.min(3, newState.attackPower + 1);
            break;
        case PowerUpType.PLAYER_CHOICE:
            if (activeQuestion?.powerUpOptions && activeQuestion?.powerUpChoicePrompt) {
                setPlayerChoiceOptions(activeQuestion.powerUpOptions);
                setPlayerChoicePrompt(activeQuestion.powerUpChoicePrompt);
                setGameState(GameState.PAUSED_PLAYER_CHOICE);
                return newState;
            }
            break;
      }
      return newState;
    });
  }, [activeQuestion]);

  const handleAnswerSubmit = useCallback((isCorrect: boolean) => {
    if (!activeQuestion) return;

    setGiftBoxes(prevBoxes => prevBoxes.map(gb =>
        gb.questionId === activeQuestion.id ? { ...gb, isOpen: true } : gb
    ));

    if (isCorrect) {
      playSound(SOUND_QUESTION_CORRECT);
      const powerUpType = activeQuestion.powerUp;
      const feedback = activeQuestion.feedbackCorrect || "That's right, my love!";

      showFeedback(feedback, "success");
      applyPowerUp(powerUpType);

      if (powerUpType === PowerUpType.LOVE_LETTER_FRAGMENT && ai.current) {
        fetchAiCoachAdvice();
      }

      const currentActiveQuestion = activeQuestion; 
      setActiveQuestion(null);

      if (currentActiveQuestion.powerUp !== PowerUpType.PLAYER_CHOICE) {
          setGameState(GameState.PLAYING);
      }
      setAnimatingGiftBoxPosition(null);

    } else {
      // playSound(SOUND_QUESTION_INCORRECT);
      showFeedback(activeQuestion.feedbackIncorrect || "Not quite, sweetheart, but keep trying!", "error");
      setActiveQuestion(null);
      setGameState(GameState.PLAYING);
      setAnimatingGiftBoxPosition(null);
    }
  }, [activeQuestion, showFeedback, applyPowerUp, fetchAiCoachAdvice, ai, playSound]);


  const handlePlayerPowerUpChoice = useCallback((chosenPowerUp: PowerUpType) => {
    playSound(SOUND_UI_CLICK);
    const powerUpDetails = POWERUP_ICON_DETAILS[chosenPowerUp];
    showFeedback(`You chose: ${powerUpDetails.name}! ${powerUpDetails.description}`, "success");
    applyPowerUp(chosenPowerUp);
    setPlayerChoiceOptions(null);
    setPlayerChoicePrompt(null);
    setGameState(GameState.PLAYING);
  }, [applyPowerUp, showFeedback, playSound]);

  const handleCloseAiCoachModal = useCallback(() => {
    playSound(SOUND_UI_CLICK);
    setIsAiCoachModalOpen(false);
    setAiCoachMessage(null);
  }, [playSound]);

  const handleActivateDreamWeaver = useCallback(async () => {
    playSound(SOUND_UI_CLICK);
    const currentPlayerState = playerStateRef.current;
    if (gameStateRef.current !== GameState.PLAYING || currentPlayerState.dreamEssenceCollected <= 0 || !ai.current) {
      if(currentPlayerState.dreamEssenceCollected <= 0) showFeedback("Not enough Dream Essence to reshape reality!", "error");
      return;
    }

    setIsDreamWeaverModalOpen(true);
    setIsDreamWeaverLoading(true);
    setPlayerState(p => ({ ...p, dreamEssenceCollected: p.dreamEssenceCollected - 1 }));

    const height = mazeGrid.length;
    const width = mazeGrid[0]?.length || 0;

    const prompt = `You are the Dream Weaver, an AI that reshapes maze layouts for a game. The current maze is ${height} rows tall and ${width} columns wide.
Your task is to generate a NEW, DIFFERENT, playable maze layout of the EXACT SAME DIMENSIONS: ${height} rows and ${width} columns.
Your output MUST be a JSON array of strings, where each string is a row.
Each character in the strings MUST be one of 'W' (wall), ' ' (floor), 'P' (player start), or 'D' (door).
There MUST be exactly one 'P' and exactly one 'D' in the entire layout.
The maze must be solvable (P can reach D).
Do NOT include any explanatory text, markdown formatting (like \`\`\`json ... \`\`\`), or anything other than the raw JSON array.
Example of a valid small JSON output (for different dimensions):
["WWDWW", "WP PW", "WW WW", "W  DW", "WWWWW"]

Generate your ${height}x${width} maze now:`;

    try {
        const response: GenerateContentResponse = await ai.current.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }

        const newLayoutStrings = JSON.parse(jsonStr) as string[];

        if (!Array.isArray(newLayoutStrings) ||
            newLayoutStrings.length !== height ||
            newLayoutStrings.some(row => typeof row !== 'string' || row.length !== width)) {
            throw new Error("Invalid maze format: Dimensions mismatch or not array of strings.");
        }
        const fullLayoutString = newLayoutStrings.join('');
        const pCount = (fullLayoutString.match(/P/g) || []).length;
        const dCount = (fullLayoutString.match(/D/g) || []).length;
        if (pCount !== 1 || dCount !== 1) {
            throw new Error(`Invalid maze format: Must have exactly one 'P' (found ${pCount}) and one 'D' (found ${dCount}).`);
        }
        if (/[^W PD]/.test(fullLayoutString)) {
            throw new Error("Invalid maze format: Contains invalid characters.");
        }

        const { grid: newGrid, playerStart: newPlayerStart, doorPosition: newDoorPosition } = parseMazeLayout(newLayoutStrings);

        if (!newPlayerStart || !newDoorPosition) {
             throw new Error("Invalid maze structure: Player start or door missing after parsing.");
        }

        setMazeGrid(newGrid);
        setPlayerState(p => ({ ...p, position: newPlayerStart }));
        setDoorPosition(newDoorPosition);
        setGiftBoxes([]);
        setPortalKeyOnMap(null);

        const currentEssenceCountAfterDecrement = playerStateRef.current.dreamEssenceCollected;
        setDreamEssenceItems([]);
        setPlayerState(p => ({...p, dreamEssenceCollected: currentEssenceCountAfterDecrement }));

        setLostWhispers([]);
        setWhisperSpawnTriggers([]); 
        showFeedback("The dream shifts around you!", "success");

    } catch (error) {
        console.error("Dream Weaver AI Error:", error);
        showFeedback(`The Dream Weaver's magic faltered! ${error instanceof Error ? error.message : 'The dream remains stable.'}`, "error");
        setPlayerState(p => ({ ...p, dreamEssenceCollected: p.dreamEssenceCollected + 1 }));
    } finally {
        setIsDreamWeaverLoading(false);
        setIsDreamWeaverModalOpen(false);
    }
  }, [gameState, mazeGrid, showFeedback, ai, playSound]);

  const handleCloseDreamWeaverModal = useCallback(() => {
    playSound(SOUND_UI_CLICK);
    setIsDreamWeaverModalOpen(false);
  }, [playSound]);

  useEffect(() => {
    if (gameStateRef.current !== GameState.PLAYING) return;
    const intervalId = setInterval(moveLostWhispersLogic, currentWhisperMoveInterval);
    return () => clearInterval(intervalId);
  }, [moveLostWhispersLogic, currentWhisperMoveInterval, gameState]);

  useEffect(() => {
    if (gameStateRef.current === GameState.PLAYING && lostWhispers.length > 0 && mazeGrid.length > 0) {
      const playerPosKey = `${playerStateRef.current.position.x},${playerStateRef.current.position.y}`;
      for (const whisper of lostWhispers) {
        const whisperPosKey = `${whisper.position.x},${whisper.position.y}`;
        if (playerPosKey === whisperPosKey) {
          handlePlayerDamage(whisper.id);
          break;
        }
      }
    }
  }, [lostWhispers, gameState, handlePlayerDamage, mazeGrid]);


  useEffect(() => {
    if (gameStateRef.current === GameState.PLAYING && !playerStateRef.current.hasPortalKey) {
      progressTimerRef.current = window.setInterval(() => {
        if (gameStateRef.current === GameState.PLAYING) {
          setTimeOnLevelWithoutProgress(prev => prev + 1000);
        }
      }, 1000);
    } else {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      setTimeOnLevelWithoutProgress(0);
    }
    return () => { if (progressTimerRef.current) clearInterval(progressTimerRef.current); };
  }, [gameState, playerState.hasPortalKey]);

  useEffect(() => {
    if (gameStateRef.current === GameState.PLAYING && timeOnLevelWithoutProgress >= FOLLOW_HEART_CLUE_TRIGGER_TIME && doorPosition && !heartCluePath && mazeGrid.length > 0) {
        showFeedback("A faint whisper guides your heart... follow the trail!", "info");
        const path: Position[] = [];
        let current = {...playerStateRef.current.position};
        for(let i=0; i < MAX_CLUE_PATH_LENGTH; i++) {
            if(current.x === doorPosition.x && current.y === doorPosition.y) break;
            if(doorPosition.x > current.x) current.x++;
            else if (doorPosition.x < current.x) current.x--;
            else if (doorPosition.y > current.y) current.y++;
            else if (doorPosition.y < current.y) current.y--;
            path.push({...current});
        }
        setHeartCluePath(path);
        setHeartClueVisibleTime(Date.now());
        setTimeOnLevelWithoutProgress(0);
    }
    if (heartCluePath && Date.now() - heartClueVisibleTime > FOLLOW_HEART_CLUE_DURATION) {
        setHeartCluePath(null);
    }
  }, [timeOnLevelWithoutProgress, doorPosition, heartCluePath, heartClueVisibleTime, showFeedback, mazeGrid, gameState]);

  useEffect(() => {
    if (playerStateRef.current.hearts <= 0 && gameStateRef.current === GameState.PLAYING) {
      setGameState(GameState.GAME_OVER); 
    }
  }, [playerState.hearts, gameState]); 

  useEffect(() => {
    if (!loveBoomerang || !loveBoomerang.isActive || gameStateRef.current !== GameState.PLAYING || !mazeGrid || mazeGrid.length === 0) {
      return;
    }
    const intervalId = setInterval(() => {
      if (gameStateRef.current !== GameState.PLAYING) { 
        clearInterval(intervalId);
        return;
      }
      setLoveBoomerang(prevBoomerang => {
        if (!prevBoomerang || !prevBoomerang.isActive) {
          clearInterval(intervalId); return null;
        }
        let { x, y } = prevBoomerang.position;
        const speed = LOVE_BOOMERANG_SPEED * TILE_SIZE;
        switch (prevBoomerang.direction) {
          case 'up': y -= speed; break;
          case 'down': y += speed; break;
          case 'left': x -= speed; break;
          case 'right': x += speed; break;
        }
        const mazePixelWidth = (mazeGrid[0]?.length || 0) * TILE_SIZE;
        const mazePixelHeight = (mazeGrid.length || 0) * TILE_SIZE;
        if (x < -TILE_SIZE || x + prevBoomerang.width > mazePixelWidth + TILE_SIZE || y < -TILE_SIZE || y + prevBoomerang.height > mazePixelHeight + TILE_SIZE) {
          return null;
        }
        const boomerangGridX = Math.floor((x + prevBoomerang.width / 2) / TILE_SIZE);
        const boomerangGridY = Math.floor((y + prevBoomerang.height / 2) / TILE_SIZE);

        if (boomerangGridY >= 0 && boomerangGridY < mazeGrid.length && boomerangGridX >= 0 && boomerangGridX < (mazeGrid[0]?.length || 0) && mazeGrid[boomerangGridY][boomerangGridX] === CellType.WALL) {
          setSootheAnimations(prev => [...prev, { id: `sa-${Date.now()}`, position: { x: boomerangGridX, y: boomerangGridY }, createdAt: Date.now() }]);
          // playSound(SOUND_BOOMERANG_WALL_HIT);
          return null;
        }
        const hitWhisperIndex = lostWhispers.findIndex(lw => lw.position.x === boomerangGridX && lw.position.y === boomerangGridY);
        if (hitWhisperIndex !== -1) {
          // playSound(SOUND_WHISPER_SOOTHED);
          const hitWhisper = lostWhispers[hitWhisperIndex];
          setSootheAnimations(prev => [...prev, { id: `sa-${Date.now()}`, position: { ...hitWhisper.position }, createdAt: Date.now() }]);
          const newConfetti: ConfettiParticle[] = Array.from({ length: CONFETTI_PARTICLE_COUNT }).map((_, i) => ({
            id: `conf-${Date.now()}-${i}`,
            position: { x: hitWhisper.position.x * TILE_SIZE + TILE_SIZE / 2, y: hitWhisper.position.y * TILE_SIZE + TILE_SIZE / 2 },
            color: `hsl(${Math.random() * 360}, 100%, 75%)`, size: TILE_SIZE * (0.15 + Math.random() * 0.2),
            velocity: { x: (Math.random() - 0.5) * CONFETTI_INITIAL_VELOCITY_X_SPREAD * TILE_SIZE * 0.05, y: (CONFETTI_INITIAL_VELOCITY_Y_MIN + Math.random() * (CONFETTI_INITIAL_VELOCITY_Y_MAX - CONFETTI_INITIAL_VELOCITY_Y_MIN)) * TILE_SIZE * 0.05 },
            rotation: Math.random() * 360, rotationSpeed: (Math.random() - 0.5) * 10, createdAt: Date.now(), opacity: 1,
          }));
          setConfettiParticles(prev => [...prev, ...newConfetti]);
          setLostWhispers(prevLWs => prevLWs.filter((_, index) => index !== hitWhisperIndex));
          return null;
        }
        return { ...prevBoomerang, position: { x, y } };
      });
    }, 50);
    return () => clearInterval(intervalId);
  }, [loveBoomerang, mazeGrid, lostWhispers, gameState, playSound]);

  useEffect(() => {
    if (confettiParticles.length === 0 || gameStateRef.current !== GameState.PLAYING) return;
    const intervalId = setInterval(() => {
      if (gameStateRef.current !== GameState.PLAYING) { 
         clearInterval(intervalId);
         return;
      }
      setConfettiParticles(prev => prev.map(p => {
        if (Date.now() - p.createdAt > CONFETTI_LIFESPAN) return null;
        return {
          ...p,
          position: { x: p.position.x + p.velocity.x, y: p.position.y + p.velocity.y },
          velocity: { ...p.velocity, y: p.velocity.y + CONFETTI_GRAVITY },
          rotation: p.rotation + p.rotationSpeed,
          opacity: 1 - (Date.now() - p.createdAt) / CONFETTI_LIFESPAN,
        };
      }).filter(p => p !== null) as ConfettiParticle[]);
    }, 50);
    return () => clearInterval(intervalId);
  }, [confettiParticles, gameState]);

  useEffect(() => {
    if (sootheAnimations.length === 0) return; 
    const intervalId = setInterval(() => {
      setSootheAnimations(prev => prev.filter(sa => Date.now() - sa.createdAt < SOOTHE_ANIMATION_DURATION));
    }, SOOTHE_ANIMATION_DURATION / 2);
    return () => clearInterval(intervalId);
  }, [sootheAnimations]);

  useEffect(() => {
    if (sparkles.length === 0) return;
    const intervalId = setInterval(() => {
      setSparkles(prev => prev.filter(s => Date.now() - s.createdAt < SPARKLE_LIFESPAN));
    }, SPARKLE_LIFESPAN / 2);
    return () => clearInterval(intervalId);
  }, [sparkles]);

  useEffect(() => {
    if (gameStateRef.current !== GameState.PLAYING || whisperSpawnTriggers.length === 0 || whisperSpawnTriggers.every(t => t.hasSpawned)) {
        return;
    }

    const playerPos = playerPositionRef.current;
    let newWhispersToSpawn: LostWhisperState[] = [];
    
    const updatedTriggers = whisperSpawnTriggers.map(trigger => {
        if (!trigger.hasSpawned) {
            const distance = Math.sqrt(
                Math.pow(playerPos.x - trigger.position.x, 2) +
                Math.pow(playerPos.y - trigger.position.y, 2)
            );

            if (distance <= trigger.spawnRadius) {
                if (lostWhispers.length + newWhispersToSpawn.length < MAX_LOST_WHISPERS_ON_SCREEN) {
                    newWhispersToSpawn.push({
                        id: `lw-triggered-${trigger.id}-${Date.now()}`,
                        position: { ...trigger.position },
                        health: 1,
                    });
                    return { ...trigger, hasSpawned: true }; 
                }
            }
        }
        return trigger;
    });

    if (newWhispersToSpawn.length > 0) {
        setLostWhispers(prev => [...prev, ...newWhispersToSpawn]);
    }
    
    const triggersStatusChanged = updatedTriggers.some((ut, i) => ut.hasSpawned !== (whisperSpawnTriggers[i] && whisperSpawnTriggers[i].hasSpawned));
    if (triggersStatusChanged) {
        setWhisperSpawnTriggers(updatedTriggers);
    }

  }, [playerState.position, whisperSpawnTriggers, gameState, lostWhispers.length]);


  useEffect(() => {
    if (gameStateRef.current !== GameState.PLAYING || !mazeGrid || mazeGrid.length === 0 || !playerStateRef.current) return;

    const currentTime = Date.now();
    if (currentTime - lastJumpScareTimestampRef.current < JUMP_SCARE_COOLDOWN_MS) {
        return;
    }

    const currentTickPotentiallyScaryWhispers = new Set<string>();
    for (const whisper of lostWhispers) {
        const dist = Math.sqrt(
            Math.pow(playerStateRef.current.position.x - whisper.position.x, 2) +
            Math.pow(playerStateRef.current.position.y - whisper.position.y, 2)
        );

        if (dist <= JUMP_SCARE_PROXIMITY_THRESHOLD) {
            const isVisibleByLOS = canSee(playerStateRef.current.position, whisper.position, mazeGrid);
            const isInFlashlight = dist <= playerStateRef.current.flashlightRadius + 0.8;

            if (isVisibleByLOS && isInFlashlight) {
                currentTickPotentiallyScaryWhispers.add(whisper.id);
                if (!prevTickPotentiallyScaryWhispersRef.current.has(whisper.id)) {
                    setJumpScareEffect({ whisperId: whisper.id, position: whisper.position, key: Date.now() });
                    lastJumpScareTimestampRef.current = currentTime;
                    playSound(SOUND_JUMP_SCARE);
                    break;
                }
            }
        }
    }
    prevTickPotentiallyScaryWhispersRef.current = currentTickPotentiallyScaryWhispers;

  }, [lostWhispers, playerState.position, playerState.flashlightRadius, mazeGrid, gameState, playSound]);

  useEffect(() => {
    if (jumpScareEffect) {
        const timer = setTimeout(() => {
            setJumpScareEffect(null);
        }, JUMP_SCARE_DURATION_MS);
        return () => clearTimeout(timer);
    }
  }, [jumpScareEffect]);

  useEffect(() => {
    if (gameStateRef.current === GameState.PLAYING) {
      realityGlitchTimerRef.current = window.setInterval(() => {
        if (gameStateRef.current !== GameState.PLAYING) { 
             if (realityGlitchTimerRef.current) clearInterval(realityGlitchTimerRef.current);
             return;
        }
        const currentTime = Date.now();
        if (currentTime - lastRealityGlitchTimestampRef.current >= REALITY_GLITCH_COOLDOWN_MS) {
          if (Math.random() < REALITY_GLITCH_TRIGGER_CHANCE) {
            setRealityGlitchTriggerKey(currentTime);
            playSound(SOUND_REALITY_GLITCH);
            lastRealityGlitchTimestampRef.current = currentTime;
          }
        }
      }, REALITY_GLITCH_INTERVAL_CHECK_MS);
    } else {
      if (realityGlitchTimerRef.current) {
        clearInterval(realityGlitchTimerRef.current);
        realityGlitchTimerRef.current = null;
      }
    }
    return () => {
      if (realityGlitchTimerRef.current) {
        clearInterval(realityGlitchTimerRef.current);
        realityGlitchTimerRef.current = null;
      }
    };
  }, [gameState, playSound]);

  useEffect(() => {
    if (realityGlitchTriggerKey) {
      const timer = setTimeout(() => {
        setRealityGlitchTriggerKey(null);
      }, REALITY_GLITCH_DURATION_MS);
      return () => clearTimeout(timer);
    }
  }, [realityGlitchTriggerKey]);

  useEffect(() => {
    return () => {
      clearRomanticTwistTimers();
      stopAllSounds(); // Ensure all sounds are stopped on unmount
    };
  }, [clearRomanticTwistTimers, stopAllSounds]);
  
  const startGame = useCallback(() => {
    playSound(SOUND_UI_CLICK); // Play click sound
    initializeLevel(1);
  }, [initializeLevel, playSound]);

  return {
    gameState, currentLevel, playerState, mazeGrid, lostWhispers, giftBoxes,
    portalKeyOnMap, activeQuestion, levelBriefing, feedbackMessage, surpriseActive,
    isLastStandAnimating, heartCluePath, sparkles, animatingGiftBoxPosition,
    loveBoomerang, sootheAnimations, confettiParticles,
    playerChoiceOptions, playerChoicePrompt,
    aiCoachMessage, isAiCoachLoading, isAiCoachModalOpen,
    dreamEssenceItems, isDreamWeaverModalOpen, isDreamWeaverLoading,
    heartLossAnimData,
    damageFlashTrigger,
    jumpScareEffect,
    realityGlitchTriggerKey,
    totalElapsedTime, 
    elapsedTimeForHUD, 
    startGame, // Export new startGame
    resetGame, handlePlayerMove, handleSootheAction, handleAimAndShoot,
    handleAnswerSubmit, handlePlayerPowerUpChoice,
    handleCloseAiCoachModal,
    handleActivateDreamWeaver, handleCloseDreamWeaverModal,
    setGameState, 
    handleResumeGame, handleReturnToMainMenu, 
    playSound, // Expose playSound for UI elements if needed directly in App.tsx
  };
};
