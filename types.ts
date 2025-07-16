export enum CellType {
  WALL = 'W',
  FLOOR = ' ',
  DOOR = 'D',
  PLAYER_START = 'P', // No longer used for initial placement, but AI might use it.
  CHEST = 'C', // Placeholder, actual chests are managed as entities
  ZOMBIE_START = 'Z', // No longer used for initial placement
  FLOWER_PUDDLE = 'F', // No longer used
  DREAM_ESSENCE = 'E', // Placeholder, actual essence items are managed as entities
}

export interface Position {
  x: number;
  y: number;
}

export enum GameState {
  START_SCREEN = 'START_SCREEN',
  PLAYING = 'PLAYING',
  PAUSED_QUESTION = 'PAUSED_QUESTION',
  LEVEL_TRANSITION = 'LEVEL_TRANSITION',
  GAME_OVER = 'GAME_OVER',
  CREDITS = 'CREDITS',
  PAUSED_PLAYER_CHOICE = 'PAUSED_PLAYER_CHOICE',
  GAME_PAUSED = 'GAME_PAUSED',
}

export type PlayerDirection = 'up' | 'down' | 'left' | 'right';

export interface PlayerState {
  position: Position;
  hearts: number;
  maxHearts: number;
  flashlightRadius: number;
  hasShield: boolean;
  attackPower: number;
  loveLetterFragmentsCollected: Set<number>;
  isCouplePowerActive: boolean;
  couplePowerDuration: number;
  lastStandUsed: boolean;
  hasPortalKey: boolean;
  firstWhisperHugThisGame: boolean; // Changed from firstWhisperHugThisLevel
  playerLastMoveDirection: PlayerDirection;
  dreamEssenceCollected: number;
}

export interface LostWhisperState {
  id: string;
  position: Position;
  health: number;
}

export interface ChestState {
  id:string;
  position: Position;
  questionId: string;
  isOpen: boolean;
  isSurpriseChest?: boolean;
}

export enum PowerUpType {
  EXTRA_HEART = 'EXTRA_HEART',
  INCREASE_FLASHLIGHT = 'INCREASE_FLASHLIGHT',
  TEMPORARY_SHIELD = 'TEMPORARY_SHIELD',
  INCREASE_SOOTHE_POWER = 'INCREASE_SOOTHE_POWER',
  LOVE_LETTER_FRAGMENT = 'LOVE_LETTER_FRAGMENT',
  COUPLE_POWER_SOOTHE = 'COUPLE_POWER_SOOTHE',
  PLAYER_CHOICE = 'PLAYER_CHOICE',
  DREAM_ESSENCE_POWERUP = 'DREAM_ESSENCE_POWERUP',
  BOOMERANG_PIERCE = 'BOOMERANG_PIERCE',
  BOOMERANG_RETURN = 'BOOMERANG_RETURN',
  BOOMERANG_SPEED_UP = 'BOOMERANG_SPEED_UP',
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  powerUp: PowerUpType;
  loveLetterFragmentId?: number;
  feedbackCorrect: string;
  feedbackIncorrect: string;
  powerUpOptions?: [PowerUpType, PowerUpType];
  powerUpChoicePrompt?: string;
}

export interface LevelDefinition {
  levelNumber: number;
  // mazeLayout: string[]; // Removed for dynamic generation
  // portalKeyPosition: Position; // Removed for dynamic generation
  questions: Question[]; // Questions will determine number of chests
  // zombieSpawnPoints: Position[]; // Removed for dynamic generation
  // chestSpawnPoints: { position: Position; questionId: string; isSurpriseChest?: boolean }[]; // Removed for dynamic generation
  // dreamEssenceSpawnPoints?: Position[]; // Removed for dynamic generation
  briefing?: string;
}

export interface Sparkle {
  id: string;
  position: Position;
  createdAt: number;
}

export interface LoveBoomerangState {
  id: string;
  position: Position;
  direction: PlayerDirection;
  isActive: boolean;
  width: number;
  height: number;
}

export interface ConfettiParticle {
  id: string;
  position: Position;
  color: string;
  size: number;
  velocity: { x: number; y: number };
  rotation: number;
  rotationSpeed: number;
  createdAt: number;
  opacity: number;
}

export interface SootheAnimationState {
  id: string;
  position: Position;
  createdAt: number;
}

export interface DreamEssenceItem {
  id: string;
  position: Position;
}