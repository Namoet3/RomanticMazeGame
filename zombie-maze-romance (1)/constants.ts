
import { PowerUpType } from "./types";

export const TILE_SIZE = 40; // pixels
export const INITIAL_PLAYER_HEARTS = 3;
export const MAX_PLAYER_HEARTS = 3;
export const FLASHLIGHT_INITIAL_RADIUS = 2.1
export const FLASHLIGHT_RADIUS_INCREMENT = 0.5;
export const MAX_FLASHLIGHT_RADIUS = 5.0;

export const ZOMBIE_MOVE_INTERVAL_BASE = 2000;
export const ZOMBIE_INTERVAL_DECREMENT_PER_LEVEL = 220;
export const MIN_ZOMBIE_MOVE_INTERVAL = 900;
export const ZOMBIES_PER_LEVEL_INCREMENT = 4; // Total potential Lost Whispers scale with this
export const MAX_LOST_WHISPERS_ON_SCREEN = 15; // Cap for simultaneously *active* Lost Whispers

export const INITIAL_ACTIVE_WHISPERS_BASE = 1; // Base number of whispers active from the start
export const INITIAL_ACTIVE_WHISPERS_INCREMENT_PER_LEVEL = 0.5; // How many more active whispers per level (can be float, then floor)
export const MAX_INITIAL_ACTIVE_WHISPERS = 3; // Max number of whispers that can start active
export const WHISPER_SPAWN_RADIUS = 3.5; // Tiles, how close player needs to be to trigger a spawn


export const ZOMBIE_VISUAL_MOVE_DURATION = 400;
export const TOTAL_LEVELS = 7;

export const LEVEL_TRANSITION_DURATION = 3500;
export const MIN_LOADING_SCREEN_DURATION = 6000; // Ensure loading screen shows for at least 3 seconds
export const FEEDBACK_MESSAGE_DURATION = 3800; // Updated from 3000
export const SURPRISE_DURATION = 1100;

export const TOTAL_LOVE_LETTER_FRAGMENTS = 5;
export const FULL_LOVE_LETTER: string[] = [
  "biricik aşkım,",
  "canım sevgilim,",
  "hayatımın anlamı,",
  "kalbimin sahibi,",
];

export const COUPLE_POWER_SOOTHE_DURATION = 15000;
export const COUPLE_POWER_SOOTHE_RADIUS = 1;

export const FOLLOW_HEART_CLUE_TRIGGER_TIME = 20000;
export const FOLLOW_HEART_CLUE_DURATION = 4000;
export const MAX_CLUE_PATH_LENGTH = 5;

export const LAST_STAND_REVIVE_HEARTS = 1;
export const LAST_STAND_ANIMATION_DURATION = 1500;
export const LAST_STAND_CLEAR_AREA_WIDTH = 4;
export const LAST_STAND_CLEAR_AREA_HEIGHT = 4;

export const CUTE_GAME_OVER_MESSAGES: string[] = [
    "Oops! A little stumble in the dream, my love. Ready to try again?",
    "Even faded dreams hold our sweet memories. Let's make more!",
    "Don't worry, sweetie! Our true adventure never ends.",
    "The dream whispers for your return... Shall we, my heart?",
    "A momentary pause in our lovely dream. Let's dive back in!",
];

export const SPARKLE_LIFESPAN = 900;
export const MAX_SPARKLES = 15;

export const GAME_STATE_TRANSITION_DURATION = 1000;

export const LOVE_BOOMERANG_SPEED = 0.2;
export const LOVE_BOOMERANG_WIDTH = TILE_SIZE * 0.5;
export const LOVE_BOOMERANG_HEIGHT = TILE_SIZE * 0.5;
export const MAX_ACTIVE_BOOMERANGS = 1;

export const CONFETTI_PARTICLE_COUNT = 15;
export const CONFETTI_LIFESPAN = 1200;
export const CONFETTI_GRAVITY = 0.05;
export const CONFETTI_INITIAL_VELOCITY_Y_MIN = -2.5;
export const CONFETTI_INITIAL_VELOCITY_Y_MAX = -1.0;
export const CONFETTI_INITIAL_VELOCITY_X_SPREAD = 1;

export const SOOTHE_ANIMATION_DURATION = 500;

export const DREAM_WEAVER_ACTIVATION_KEY = 'e'; // Key to activate Dream Weaver

// Spam Penalty Constants
export const SPAM_SHOT_COUNT = 20;
export const SPAM_WINDOW_MS = 7000; // 7 seconds
export const SHOOTING_PENALTY_MS = 15000; // 15 seconds

// Jump Scare Constants (Lost Whisper related)
export const JUMP_SCARE_PROXIMITY_THRESHOLD = 1.5; // tiles
export const JUMP_SCARE_COOLDOWN_MS = 25000; // Increased from 5000ms (12 seconds global cooldown)
export const JUMP_SCARE_DURATION_MS = 700; // 0.7 seconds duration of the scare effect

// Reality Glitch Jump Scare Constants
export const REALITY_GLITCH_INTERVAL_CHECK_MS = 5000; // Check every 5 seconds
export const REALITY_GLITCH_TRIGGER_CHANCE = 0.10; // Decreased from 0.15 (10% chance to trigger on check)
export const REALITY_GLITCH_COOLDOWN_MS = 90000; // Increased from 45000ms (90 seconds cooldown between glitches)
export const REALITY_GLITCH_DURATION_MS = 350; // Visual effect lasts 350ms

export interface PowerUpIconDetail {
  name: string;
  IconComponent: string;
  description: string;
}

export const POWERUP_ICON_DETAILS: Record<PowerUpType, PowerUpIconDetail> = {
  [PowerUpType.EXTRA_HEART]: { name: "Fazladan Aşk", IconComponent: "HeartIcon", description: "Büyüyen aşkımızı simgeleyen fazladan bir kalp kazan!" },
  [PowerUpType.INCREASE_FLASHLIGHT]: { name: "Daha Parlak Aura", IconComponent: "AuraIncreaseIcon", description: "Aşk Auranı genişlet, rüyanın daha fazlasını aydınlat." },
  [PowerUpType.TEMPORARY_SHIELD]: { name: "Aşk Kalkanı", IconComponent: "ShieldIcon", description: "Sakar bir Fısıltı'nın sarılmasından seni koruyacak geçici bir kalkan." },
  [PowerUpType.LOVE_LETTER_FRAGMENT]: { name: "Mektup Parçası", IconComponent: "LetterFragmentIcon", description: "Benden sana özel bir aşk notunu ortaya çıkarmak için bunları topla!" },
  [PowerUpType.COUPLE_POWER_SOOTHE]: { name: "Çift Gücü", IconComponent: "DoubleHeartIcon", description: "Kısa bir süreliğine Yatıştırma yeteneğin büyük ölçüde artar!" },
  [PowerUpType.INCREASE_SOOTHE_POWER]: { name: "Nazik Dokunuş", IconComponent: "SparklingWandIcon", description: "Kayıp Fısıltıları yatıştırma yeteneğini artırır (Gelecekteki Bumerang Yükseltmesi!)." },
  [PowerUpType.PLAYER_CHOICE]: { name: "Özel Bir Seçim", IconComponent: "GiftBoxIcon", description: "Aşkımız sana iki lütuf arasında bir seçim hakkı tanıyor!" },
  [PowerUpType.DREAM_ESSENCE_POWERUP]: { name: "Rüya Özü", IconComponent: "DreamEssenceIcon", description: "Rüya Dokuyucusu ile rüyayı yeniden şekillendirmek için topla!" },
  [PowerUpType.BOOMERANG_PIERCE]: { name: "Delip Geçen Kalp", IconComponent: "HeartIcon", description: "Aşk Bumerangın bir Fısıltı'nın içinden geçebilir!" },
  [PowerUpType.BOOMERANG_RETURN]: { name: "Geri Dönen Aşk", IconComponent: "HeartIcon", description: "Aşk Bumerangın kısa bir mesafeden sonra sana geri dönecek!" },
  [PowerUpType.BOOMERANG_SPEED_UP]: { name: "Süratli Kalp", IconComponent: "HeartIcon", description: "Aşk Bumerangın daha hızlı hareket eder!" },
};

// Sound Constants
export const SFX_VOLUME_DEFAULT = 0.7;
export const MUSIC_VOLUME_DEFAULT = 0.3;

// Sound Effects
export const SOUND_REALITY_GLITCH = '/assets/sounds/reality_glitch.mp3';
export const SOUND_PLAYER_SHOOT_BOOMERANG = '/assets/sounds/boomerang_throw.wav';
export const SOUND_PLAYER_DAMAGE = '/assets/sounds/player_hurt.wav';
export const SOUND_QUESTION_CORRECT = '/assets/sounds/question_correct.wav'; // Added as a suggestion from thought process
export const SOUND_JUMP_SCARE = '/assets/sounds/jumpscare_sound.mp3'; // For Lost Whisper jump scare

// Background Music
export const SOUND_MUSIC_MENU = '/assets/music/menu_theme.mp3';
export const SOUND_MUSIC_GAMEPLAY = '/assets/music/gameplay_theme.mp3';
export const SOUND_MUSIC_GAMEOVER = '/assets/music/dream_fades.mp3';
export const SOUND_MUSIC_CREDITS = '/assets/music/love_theme_reprise.mp3';

// UI Sounds (Optional, but good to have)
export const SOUND_UI_CLICK = '/assets/sounds/ui_click.wav';

// List of sounds to preload
export const SOUNDS_TO_PRELOAD = [
  SOUND_REALITY_GLITCH,
  SOUND_PLAYER_SHOOT_BOOMERANG,
  SOUND_PLAYER_DAMAGE,
  SOUND_QUESTION_CORRECT,
  SOUND_JUMP_SCARE,
  SOUND_UI_CLICK,
  SOUND_MUSIC_MENU,
  SOUND_MUSIC_GAMEPLAY,
  SOUND_MUSIC_GAMEOVER,
  SOUND_MUSIC_CREDITS,
];
