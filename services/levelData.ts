
import { LevelDefinition, Question, PowerUpType, Position, CellType } from '../types';
const cuteRomanticQuestions: Question[] = [
    { id: 'q1', text: "Question 1", options: ["Option A", "Option B", "Option C", "Option D"], correctAnswerIndex: 1, powerUp: PowerUpType.EXTRA_HEART, feedbackCorrect: "Correct Feedback 1", feedbackIncorrect: "Incorrect Feedback 1" },
    { id: 'q2', text: "Question 2", options: ["Option A", "Option B", "Option C", "Option D"], correctAnswerIndex: 0, powerUp: PowerUpType.INCREASE_FLASHLIGHT, feedbackCorrect: "Correct Feedback 2", feedbackIncorrect: "Incorrect Feedback 2" },
    { id: 'q3', text: "Question 3", options: ["Option A", "Option B", "Option C", "Option D"], correctAnswerIndex: 2, powerUp: PowerUpType.TEMPORARY_SHIELD, feedbackCorrect: "Correct Feedback 3", feedbackIncorrect: "Incorrect Feedback 3" },
    { id: 'q4', text: "Question 4", options: ["Option A", "Option B", "Option C", "Option D"], correctAnswerIndex: 3, powerUp: PowerUpType.LOVE_LETTER_FRAGMENT, loveLetterFragmentId: 0, feedbackCorrect: "Correct Feedback 4", feedbackIncorrect: "Incorrect Feedback 4" },
    { id: 'q5', text: "Question 5", options: ["Option A", "Option B", "Option C", "Option D"], correctAnswerIndex: 1, powerUp: PowerUpType.LOVE_LETTER_FRAGMENT, loveLetterFragmentId: 1, feedbackCorrect: "Correct Feedback 5", feedbackIncorrect: "Incorrect Feedback 5" },
    { id: 'q6', text: "Question 6", options: ["Option A", "Option B", "Option C", "Option D"], correctAnswerIndex: 3, powerUp: PowerUpType.COUPLE_POWER_SOOTHE, feedbackCorrect: "Correct Feedback 6", feedbackIncorrect: "Incorrect Feedback 6" },
    { id: 'q7', text: "Question 7", options: ["Option A", "Option B", "Option C", "Option D"], correctAnswerIndex: 0, powerUp: PowerUpType.LOVE_LETTER_FRAGMENT, loveLetterFragmentId: 2, feedbackCorrect: "Correct Feedback 7", feedbackIncorrect: "Incorrect Feedback 7" },
    { id: 'q8', text: "Question 8", options: ["Option A", "Option B", "Option C", "Option D"], correctAnswerIndex: 1, powerUp: PowerUpType.INCREASE_SOOTHE_POWER, feedbackCorrect: "Correct Feedback 8", feedbackIncorrect: "Incorrect Feedback 8" },
    { id: 'q9', text: "Question 9", options: ["Option A", "Option B", "Option C", "Option D"], correctAnswerIndex: 3, powerUp: PowerUpType.EXTRA_HEART, loveLetterFragmentId: 3, feedbackCorrect: "Correct Feedback 9", feedbackIncorrect: "Incorrect Feedback 9" },
    { id: 'q10', text: "Question 10", options: ["Option A", "Option B", "Option C", "Option D"], correctAnswerIndex: 1, powerUp: PowerUpType.LOVE_LETTER_FRAGMENT, loveLetterFragmentId: 4, feedbackCorrect: "Correct Feedback 10", feedbackIncorrect: "Incorrect Feedback 10" },
    { id: 'q11', text: "Question 11", options: ["Option A", "Option B", "Option C", "Option D"], correctAnswerIndex: 2, powerUp: PowerUpType.INCREASE_FLASHLIGHT, feedbackCorrect: "Correct Feedback 11", feedbackIncorrect: "Incorrect Feedback 11" },
    { id: 'q12', text: "Question 12", options: ["Option A", "Option B", "Option C", "Option D"], correctAnswerIndex: 3, powerUp: PowerUpType.TEMPORARY_SHIELD, feedbackCorrect: "Correct Feedback 12", feedbackIncorrect: "Incorrect Feedback 12" },
    { id: 'pkq1', text: "Question 13", options: ["Option A", "Option B", "Option C", "Option D"], correctAnswerIndex: 3, powerUp: PowerUpType.EXTRA_HEART, feedbackCorrect: "Correct Feedback 13", feedbackIncorrect: "Incorrect Feedback 13" },
    { id: 'pkq2', text: "Question 14", options: ["Option A", "Option B", "Option C", "Option D"], correctAnswerIndex: 3, powerUp: PowerUpType.LOVE_LETTER_FRAGMENT, feedbackCorrect: "Correct Feedback 14", feedbackIncorrect: "Incorrect Feedback 14" },
  {
    id: 'q_player_choice_1',
    text: "Aşkım, yolculuğumuz için özel bir lütuf seçebilseydin, bu ne olurdu?",
    options: ["A brighter path", "A moment of extra strength", "A shield of our memories", "A deeper connection"], 
    correctAnswerIndex: 0, 
    powerUp: PowerUpType.PLAYER_CHOICE,
    powerUpOptions: [PowerUpType.INCREASE_FLASHLIGHT, PowerUpType.COUPLE_POWER_SOOTHE], 
    powerUpChoicePrompt: "Aşkımız sana bir seçim hakkı tanıyor, biricik aşkım:",
    feedbackCorrect: "A wise decision! May this blessing light your way or bolster your spirit!",
    feedbackIncorrect: "Even in dreams, every path leads to discovery! But no choice this time."
  },
  {
    id: 'q_player_choice_2',
    text: "Bazen bir rüya yol ayrımı sunar. Hangi lütfu arzu edersin?",
    options: ["More love to share", "Protection from the shadows"],
    correctAnswerIndex: 1,
    powerUp: PowerUpType.PLAYER_CHOICE,
    powerUpOptions: [PowerUpType.EXTRA_HEART, PowerUpType.TEMPORARY_SHIELD],
    powerUpChoicePrompt: "Lütfunu seç, aşkım:",
    feedbackCorrect: "Excellent choice! This will surely help you.",
    feedbackIncorrect: "A difficult question perhaps! No choice for now, but our journey continues."
  }
];

export const levels: LevelDefinition[] = [
  {
    levelNumber: 1,
    briefing: "Hoş geldin biricik aşkım... Yolu açmak için fiziksel Portal Anahtarını bul. Hediye Kutularında tatlı sırlar seni bekliyor! Aşk Bumerangı fırlatmak için <kbd>Boşluk</kbd> veya <kbd>Ok Tuşlarını</kbd> kullan!",
    questions: [], // 0 chests
  },
  {
    levelNumber: 2,
    briefing: "Rüya derinleşiyor. Portal Anahtarı gizli. Aşkımızın bilgisi, Hediye Kutuları aracılığıyla yol gösteren yıldızın. Gerçekliği yeniden şekillendirmek için Rüya Özü ile <kbd>E</kbd> tuşuna bas!",
    questions: [
        cuteRomanticQuestions.find(q => q.id === 'q1')!, 
    ].filter(Boolean) as Question[], // 1 chest
  },
   {
    levelNumber: 3,
    briefing: "Anıların melodileri yankılanıyor. Anahtarı bul. Her Hediye Kutusundaki paylaştığımız anlara güven.",
    questions: [
        cuteRomanticQuestions.find(q => q.id === 'q2')!,
        cuteRomanticQuestions.find(q => q.id === 'q3')!,
    ].filter(Boolean) as Question[], // 2 chests
  },
  {
    levelNumber: 4,
    briefing: "Yolun yarısı! Aşkın parlak bir aura. Portal Anahtarı yakın olmalı. Yalnız olduğuna emin misin?",
    questions: [
        cuteRomanticQuestions.find(q => q.id === 'q4')!,
        cuteRomanticQuestions.find(q => q.id === 'q5')!, 
    ].filter(Boolean) as Question[], // 2 chests
  },
  {
    levelNumber: 5,
    briefing: "Duvarlar şarkımızı mırıldanıyor. Anahtar senin kreşendon. Tereddüt etme!",
    questions: [
        cuteRomanticQuestions.find(q => q.id === 'q6')!, 
        cuteRomanticQuestions.find(q => q.id === 'q7')!, 
    ].filter(Boolean) as Question[], // 2 chests
  },
  {
    levelNumber: 6,
    briefing: "Portal yakın, yoksa bir illüzyon mu? Anahtar kalbinin gerçeğini kanıtlıyor. Son bir test.",
    questions: [
        cuteRomanticQuestions.find(q => q.id === 'q8')!, 
        cuteRomanticQuestions.find(q => q.id === 'q9')!,
        cuteRomanticQuestions.find(q => q.id === 'q10')!,
    ].filter(Boolean) as Question[], // 3 chests
  },
  {
    levelNumber: 7,
    briefing: "Rüyanın kalbi... Kalbimin nihai Anahtarını bul. Sana inanıyorum. Seni bekliyorum.",
    questions: [
        cuteRomanticQuestions.find(q => q.id === 'q11')!,
        cuteRomanticQuestions.find(q => q.id === 'q12')!,
        cuteRomanticQuestions.find(q => q.id === 'pkq1')!,
        cuteRomanticQuestions.find(q => q.id === 'pkq2')!,
    ].filter(Boolean) as Question[], // 4 chests
  },
];


export const parseMazeLayout = (layout: string[]): {
    grid: CellType[][],
    playerStart: Position,
    doorPosition?: Position,
} => {
    let playerStartPos: Position = { x: 0, y: 0 };
    let doorPos: Position | undefined = undefined;
    let playerStartFound = false;
    let doorFound = false;

    const grid: CellType[][] = layout.map((rowStr, y) => {
        return rowStr.split('').map((char, x) => {
            const cell = char as CellType;
            if (cell === CellType.PLAYER_START) {
                if (!playerStartFound) {
                    playerStartPos = { x, y };
                    playerStartFound = true;
                    return CellType.FLOOR; 
                } else {
                     console.warn(`Multiple Player Starts ('P') found in maze layout for level. Using first at ${playerStartPos.x},${playerStartPos.y}. Additional at ${x},${y} ignored.`);
                    return CellType.FLOOR; 
                }
            }
            if (cell === CellType.DOOR) {
                if (!doorFound) {
                    doorPos = { x, y };
                    doorFound = true;
                } else {
                    console.warn(`Multiple Doors ('D') found in maze layout for level. Using first at ${doorPos?.x},${doorPos?.y}. Additional at ${x},${y} ignored.`);
                }
                return CellType.DOOR; 
            }
            if (cell === CellType.ZOMBIE_START || cell === CellType.CHEST || cell === CellType.FLOWER_PUDDLE || cell === CellType.DREAM_ESSENCE) {
                return CellType.FLOOR; 
            }
            return cell; 
        });
    });

    if (!playerStartFound && layout.length > 0 && layout[0].length > 0) {
        console.warn("Player start 'P' not found in maze layout. Defaulting to first available floor or (1,1).");
        let foundFallbackStart = false;
        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[r].length; c++) {
                if (grid[r][c] === CellType.FLOOR) {
                    playerStartPos = {x: c, y: r};
                    foundFallbackStart = true;
                    break;
                }
            }
            if (foundFallbackStart) break;
        }
        if (!foundFallbackStart) {
             playerStartPos = {x: 1, y: 1}; 
             if (grid.length > 1 && grid[0].length > 1) {
                 grid[1][1] = CellType.FLOOR; 
             }
        }
    } else if (layout.length === 0 || (layout[0] && layout[0].length === 0) ) {
        console.error("Maze layout is empty or malformed. Cannot determine player start.");
        const defaultGrid = [[CellType.WALL, CellType.WALL, CellType.WALL], [CellType.WALL, CellType.FLOOR, CellType.WALL], [CellType.WALL, CellType.WALL, CellType.WALL]];
        return { grid: defaultGrid as CellType[][], playerStart: {x:1,y:1}, doorPosition: undefined};
    }
    
    if (grid[playerStartPos.y]?.[playerStartPos.x] === CellType.WALL) {
        grid[playerStartPos.y][playerStartPos.x] = CellType.FLOOR;
    }
    if (doorPos && (doorPos.y >= grid.length || doorPos.x >= (grid[0]?.length || 0))) {
        console.warn("Door position from AI is out of bounds. Setting to undefined.");
        doorPos = undefined;
    }

    return { grid, playerStart: playerStartPos, doorPosition: doorPos };
};
